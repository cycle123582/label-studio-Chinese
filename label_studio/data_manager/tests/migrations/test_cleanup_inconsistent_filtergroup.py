from django.test import TestCase
from importlib import import_module, reload

from projects.tests.factories import ProjectFactory
from data_manager.models import View, FilterGroup, Filter
from core.models import AsyncMigrationStatus


class TestCleanupInconsistentFiltergroupMigration(TestCase):

    def setUp(self):
        # Filter group 1
        self.filter_group_1 = FilterGroup.objects.create(conjunction='and')
        self.filter_1 = Filter.objects.create(index=0, column='id', type='number', operator='eq', value=1)
        self.filter_2 = Filter.objects.create(index=1, column='id', type='number', operator='eq', value=2)
        self.filter_group_1.filters.add(self.filter_1)
        self.filter_group_1.filters.add(self.filter_2)

        # Filter group 2
        self.filter_group_2 = FilterGroup.objects.create(conjunction='or')
        self.filter_3 = Filter.objects.create(index=0, column='id', type='number', operator='eq', value=1)
        self.filter_4 = Filter.objects.create(index=1, column='id', type='number', operator='eq', value=2)
        self.filter_group_2.filters.add(self.filter_3)
        self.filter_group_2.filters.add(self.filter_4)


        # Project 1
        self.project_1 = ProjectFactory()
        self.view_1 = View.objects.create(project=self.project_1, filter_group=self.filter_group_1)
        self.view_2 = View.objects.create(project=self.project_1, filter_group=self.filter_group_2)

        # Project 2
        self.project_2 = ProjectFactory()
        # These views don't have their own filter group.
        self.view_3 = View.objects.create(project=self.project_2, filter_group=self.filter_group_1)
        self.view_4 = View.objects.create(project=self.project_2, filter_group=self.filter_group_2)

        # Project 3
        self.project_3 = ProjectFactory()
        # This view doesn't have its own filter group.
        self.view_5 = View.objects.create(project=self.project_3, filter_group=self.filter_group_1)


        # Unaffected project, filters and views
        self.project_unaffected = ProjectFactory()
        self.filter_group_unaffected = FilterGroup.objects.create(conjunction='and')
        self.filter_unaffected = Filter.objects.create(index=0, column='id', type='number', operator='eq', value=1)
        self.filter_group_unaffected.filters.add(self.filter_unaffected)
        self.view_unaffected = View.objects.create(project=self.project_unaffected, filter_group=self.filter_group_unaffected)
    
    def _assert_equivalent_filter_group(self, filter_group_1, filter_group_2):
        assert filter_group_1.conjunction == filter_group_2.conjunction

        # Check both filter groups have same number of filters
        assert filter_group_1.filters.count() == filter_group_2.filters.count()

        # Get filters sorted by index to compare in order
        filters_1 = filter_group_1.filters.order_by('index')
        filters_2 = filter_group_2.filters.order_by('index')

        # Compare each filter's attributes
        for f1, f2 in zip(filters_1, filters_2):
            assert f1.column == f2.column
            assert f1.type == f2.type
            assert f1.operator == f2.operator
            assert f1.value == f2.value
            assert f1.index == f2.index

    def test_migration(self):
        AsyncMigrationStatus.objects.all().delete() # cleanup migrations run when creating test database
        assert AsyncMigrationStatus.objects.filter(name='0013_cleanup_inconsistent_filtergroup_20250624_2119').count() == 0

        # Assert initial state
        assert FilterGroup.objects.count() == 3
        assert Filter.objects.count() == 5
        
        # Run migration
        module = import_module('data_manager.migrations.0013_cleanup_inconsistent_filtergroup_20250624_2119')
        reload(module)
        module.cleanup_inconsistent_filtergroup()

        migration = AsyncMigrationStatus.objects.get(name='0013_cleanup_inconsistent_filtergroup_20250624_2119')
        assert migration.status == AsyncMigrationStatus.STATUS_FINISHED
        assert set(migration.meta['project_ids']) == set([self.project_1.id, self.project_2.id, self.project_3.id])

        # Assert final state
        assert FilterGroup.objects.count() == 6
        assert Filter.objects.count() == 11

        # Assert filter groups are equivalent for views that shared filter_group_1
        self.view_1.refresh_from_db()
        self.view_2.refresh_from_db()
        self.view_3.refresh_from_db()
        self.view_4.refresh_from_db()
        self.view_5.refresh_from_db()

        # View 1 keeps original filter group
        assert self.view_1.filter_group == self.filter_group_1
        # View 2 keeps original filter group
        assert self.view_2.filter_group == self.filter_group_2
        # View 3 gets new equivalent filter group
        assert self.view_3.filter_group != self.filter_group_1
        self._assert_equivalent_filter_group(self.view_3.filter_group, self.filter_group_1)
        # View 4 gets new equivalent filter group
        assert self.view_4.filter_group != self.filter_group_2
        self._assert_equivalent_filter_group(self.view_4.filter_group, self.filter_group_2)
        # View 5 gets new equivalent filter group
        assert self.view_5.filter_group != self.filter_group_1
        self._assert_equivalent_filter_group(self.view_5.filter_group, self.filter_group_1)
        # Assert unaffected view/filter group remains unchanged
        self.view_unaffected.refresh_from_db()
        assert self.view_unaffected.filter_group == self.filter_group_unaffected


        

        