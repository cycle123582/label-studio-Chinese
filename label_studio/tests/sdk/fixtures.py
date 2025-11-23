import pytest
from label_studio_sdk.client import LabelStudio
from label_studio_sdk.data_manager import Column, Filters, Operator, Type

from .common import LABEL_CONFIG_AND_TASKS


@pytest.fixture
def test_project_with_view(django_live_url, business_client):
    ls = LabelStudio(base_url=django_live_url, api_key=business_client.api_key)
    p = ls.projects.create(title='New Project', label_config=LABEL_CONFIG_AND_TASKS['label_config'])

    project = ls.projects.get(id=p.id)

    task_data = [{'data': {'my_text': 'Test task ' + str(i)}} for i in range(10)]
    ls.projects.import_tasks(id=project.id, request=task_data)
    orig_tasks = []
    for task in ls.tasks.list(project=project.id):
        orig_tasks.append(task)

    filters = Filters.create(
        Filters.OR,
        [Filters.item(Column.id, Operator.EQUAL, Type.Number, Filters.value(t.id)) for t in orig_tasks[::2]],
    )

    view = ls.views.create(
        project=project.id, data=dict(title='Test View', filters=filters, ordering=['-' + Column.id])
    )
    return ls, project, orig_tasks, view
