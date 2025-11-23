from django.test import TestCase
from ml_model_providers.models import ModelProviderConnection
from organizations.tests.factories import OrganizationFactory


class TestModelProviderConnection(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.organization = OrganizationFactory()

    def test_has_reached_budget_limit(self):
        mpc = ModelProviderConnection.objects.create(
            organization=self.organization,
            created_by=self.organization.created_by,
        )
        # Not internal
        assert not mpc.has_reached_budget_limit()
        mpc.is_internal = True
        mpc.save()
        # No budget_total_spent
        assert not mpc.has_reached_budget_limit()
        mpc.budget_total_spent = 1000
        mpc.save()
        # No budget_limit
        assert not mpc.has_reached_budget_limit()
        mpc.budget_limit = 2000
        mpc.save()
        # Not reached
        assert not mpc.has_reached_budget_limit()
        mpc.budget_total_spent = 2001
        # Reached
        assert mpc.has_reached_budget_limit()
