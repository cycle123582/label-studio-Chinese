"""This file and its contents are licensed under the Apache License 2.0. Please see the included NOTICE for copyright information and LICENSE for a copy of the license.
"""

import logging

# 1. 引入翻译函数
from django.utils.translation import gettext_lazy as _

from core.permissions import AllPermissions
from core.redis import start_job_async_or_sync
from data_manager.actions import DataManagerAction
from label_studio_sdk.label_interface import LabelInterface
from tasks.models import Annotation, Prediction, Task

logger = logging.getLogger(__name__)
all_permissions = AllPermissions()


def cache_labels_job(project, queryset, **kwargs):
    request_data = kwargs['request_data']
    source = request_data.get('source', 'annotations').lower()
    assert source in ['annotations', 'predictions'], 'Source must be annotations or predictions'
    source_class = Annotation if source == 'annotations' else Prediction
    control_tag = request_data.get('custom_control_tag') or request_data.get('control_tag')
    with_counters = request_data.get('with_counters', 'Yes').lower() == 'yes'
    label_interface = LabelInterface(project.label_config)
    label_interface_tags = {tag.name: tag for tag in label_interface.find_tags('control')}

    if source == 'annotations':
        column_name = 'cache'
    else:
        column_name = 'cache_predictions'

    # ALL is a special case, we will cache all labels from all control tags into one column
    if control_tag == 'ALL' or control_tag is None:
        control_tag = None
        column_name = f'{column_name}_all'
    else:
        column_name = f'{column_name}_{control_tag}'

    tasks = list(queryset.only('data'))
    logger.info(f'Cache labels for {len(tasks)} tasks and control tag {control_tag}')

    for task in tasks:
        task_labels = []
        annotations = source_class.objects.filter(task=task).only('result')
        for annotation in annotations:
            labels = extract_labels(annotation, control_tag, label_interface_tags)
            task_labels.extend(labels)

        # cache labels in separate data column
        # with counters
        if with_counters:
            task.data[column_name] = ', '.join(
                sorted([f'{label}: {task_labels.count(label)}' for label in set(task_labels)])
            )
        # no counters
        else:
            task.data[column_name] = ', '.join(sorted(list(set(task_labels))))

    Task.objects.bulk_update(tasks, fields=['data'], batch_size=1000)
    first_task = Task.objects.get(id=queryset.first().id)
    project.summary.update_data_columns([first_task])

    # 汉化反馈信息
    msg = _('已更新 {} 个任务').format(len(tasks))
    return {'response_code': 200, 'detail': msg}


def extract_labels(annotation, control_tag, label_interface_tags=None):
    labels = []
    for region in annotation.result:
        # find regions with specific control tag name or just all regions if control tag is None
        if (control_tag is None or region['from_name'] == control_tag) and 'value' in region:
            # scan value for a field with list of strings (eg choices, textareas)
            # or taxonomy (list of string-lists)
            for key in region['value']:
                if region['value'][key] and isinstance(region['value'][key], list):

                    if key == 'taxonomy':
                        showFullPath = 'true'
                        pathSeparator = '/'
                        if label_interface_tags is not None and region['from_name'] in label_interface_tags:
                            # if from_name is not a custom_control tag, then we can try to fetch taxonomy formatting params
                            label_interface_tag = label_interface_tags[region['from_name']]
                            showFullPath = label_interface_tag.attr.get('showFullPath', 'false')
                            pathSeparator = label_interface_tag.attr.get('pathSeparator', '/')

                        if showFullPath == 'false':
                            for elems in region['value'][key]:
                                labels.append(elems[-1])  # just the leaf node of a taxonomy selection
                        else:
                            for elems in region['value'][key]:
                                labels.append(pathSeparator.join(elems))  # the full delimited taxonomy path

                    # other control tag types like Choices & TextAreas
                    elif isinstance(region['value'][key][0], str):
                        labels.extend(region['value'][key])

                    break
    return labels


def cache_labels(project, queryset, request, **kwargs):
    """Cache labels from annotations to a new column in tasks"""
    start_job_async_or_sync(
        cache_labels_job,
        project,
        queryset,
        organization_id=project.organization_id,
        request_data=request.data,
        job_timeout=60 * 60 * 5,  # max allowed duration is 5 hours
    )
    return {'response_code': 200}


def cache_labels_form(user, project):
    labels = project.get_parsed_config()
    # 汉化下拉选项：将简单的字符串列表改为 {value, label} 结构
    # 这样后端收到的 value 还是 'ALL'，但前端显示的是中文 '所有'
    control_tags = [{'value': 'ALL', 'label': _('所有')}]

    for key, _ in labels.items():
        control_tags.append({'value': key, 'label': key})

    return [
        {
            'columnCount': 1,
            'fields': [
                {
                    'type': 'select',
                    'name': 'control_tag',
                    'label': _('选择一个控制标签'),  # 汉化
                    'options': control_tags,
                },
                {
                    'type': 'input',
                    'name': 'custom_control_tag',
                    'label': _('自定义控制标签（如果未在标签配置中）'),  # 汉化
                },
                {
                    'type': 'select',
                    'name': 'with_counters',
                    'label': _('包含计数'),  # 汉化
                    # 使用 value/label 结构，保证后端逻辑（检测 'Yes'）不变
                    'options': [
                        {'value': 'Yes', 'label': _('是')},
                        {'value': 'No', 'label': _('否')}
                    ],
                },
                {
                    'type': 'select',
                    'name': 'source',
                    'label': _('来源'),  # 汉化
                    # 使用 value/label 结构，保证后端逻辑（检测 'annotations'）不变
                    'options': [
                        {'value': 'Annotations', 'label': _('标注')},
                        {'value': 'Predictions', 'label': _('预测')}
                    ],
                },
            ],
        }
    ]


actions: list[DataManagerAction] = [
    {
        'entry_point': cache_labels,
        'permission': all_permissions.projects_change,
        'title': _('缓存标签'),  # 汉化菜单名称
        'order': 1,
        'experimental': True,
        'dialog': {
            'text': _('请确认您想添加一个新的 task.data 字段来存储来自标注的缓存标签。\n'
                      '此字段将帮助您按标签快速过滤或排序任务。\n'
                      '操作完成后，您必须完全刷新数据管理器页面才能看到新列！'),  # 汉化弹窗提示
            'type': 'confirm',
            'form': cache_labels_form,
        },
    },
]