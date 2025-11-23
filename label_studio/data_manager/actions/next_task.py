"""This file and its contents are licensed under the Apache License 2.0. Please see the included NOTICE for copyright information and LICENSE for a copy of the license.
"""
import logging

# 1. 引入翻译函数
from django.utils.translation import gettext_lazy as _

from core.permissions import all_permissions
from data_manager.actions import DataManagerAction
from data_manager.functions import filters_ordering_selected_items_exist
from projects.functions.next_task import get_next_task
from rest_framework.exceptions import NotFound
from tasks.serializers import NextTaskSerializer

logger = logging.getLogger(__name__)


def next_task(project, queryset, **kwargs):
    """Generate next task for labeling stream

    :param project: project
    :param queryset: task ids to sample from
    :param kwargs: arguments from api request
    """

    request = kwargs['request']
    dm_queue = filters_ordering_selected_items_exist(request.data)
    next_task, queue_info = get_next_task(request.user, queryset, project, dm_queue)

    if next_task is None:
        # 汉化错误提示，将 f-string 转换为 .format() 形式以配合 gettext_lazy
        msg = _('未找到适合 {user} 的任务').format(user=request.user)
        raise NotFound(msg)

    # serialize task
    context = {'request': request, 'project': project, 'resolve_uri': True, 'annotations': False}
    serializer = NextTaskSerializer(next_task, context=context)
    response = serializer.data
    response['queue'] = queue_info
    return response


actions: list[DataManagerAction] = [
    {
        'entry_point': next_task,
        'permission': all_permissions.projects_view,
        'title': _('生成下一个任务'),  # 汉化 (虽然目前 hidden=True，但保持一致性)
        'order': 0,
        'hidden': True,
    }
]