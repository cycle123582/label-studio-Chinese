"""This file and its contents are licensed under the Apache License 2.0. Please see the included NOTICE for copyright information and LICENSE for a copy of the license.
"""
import logging
from collections import OrderedDict
from typing import Any, Iterable, Tuple
from urllib.parse import unquote

import ujson as json
# 1. 引入翻译函数
from django.utils.translation import gettext_lazy as _
from core.feature_flags import flag_set
from core.utils.common import int_from_request
from data_manager.models import View
from data_manager.prepare_params import PrepareParams
from django.conf import settings
from rest_framework.generics import get_object_or_404
from tasks.models import Task

TASKS = 'tasks:'
logger = logging.getLogger(__name__)


class DataManagerException(Exception):
    pass


# 修正：将 *_ 改为 *args，避免覆盖翻译函数 _
def get_all_columns(project, *args):
    """Make columns info for the frontend data manager"""
    result = {'columns': []}

    # frontend uses MST data model, so we need two directional referencing parent <-> child
    task_data_children = []
    i = 0

    data_types = OrderedDict()

    # add data types from config again
    project_data_types = {}
    for key, value in project.data_types.items():
        # skip keys from Repeater tag, because we already have its base data,
        # e.g.: skip 'image[{{idx}}]' because we have 'image' list already
        if '[' not in key:
            project_data_types[key] = value
    data_types.update(project_data_types.items())

    # all data types from import data
    all_data_columns = project.summary.all_data_columns
    logger.info(f'get_all_columns: project_id={project.id} {all_data_columns=} {data_types=}')
    if all_data_columns:
        data_types.update({key: 'Unknown' for key in all_data_columns if key not in data_types})
    logger.info(f'get_all_columns: project_id={project.id} {data_types=}')

    # remove $undefined$ if there is one type at least in labeling config, because it will be resolved automatically
    if len(project_data_types) > 0:
        data_types.pop(settings.DATA_UNDEFINED_NAME, None)
    logger.info(f'get_all_columns: project_id={project.id} {data_types=} {project_data_types=}')

    for key, data_type in list(data_types.items()):  # make data types from labeling config first
        column = {
            'id': key,
            # 汉化: 如果是未定义名称显示为'数据'，否则显示键名
            'title': key if key != settings.DATA_UNDEFINED_NAME else _('数据'),
            'type': data_type if data_type in ['Image', 'Audio', 'AudioPlus', 'Video', 'Unknown'] else 'String',
            'target': 'tasks',
            'parent': 'data',
            'visibility_defaults': {
                'explore': True,
                'labeling': key in project_data_types or key == settings.DATA_UNDEFINED_NAME,
            },
            'project_defined': True,
        }
        result['columns'].append(column)
        task_data_children.append(column['id'])
        i += 1

    remove_members_schema = flag_set('fflag_feat_fit_449_datamanager_filter_members_short', user='auto')

    # --- Data root ---
    data_root = {
        'id': 'data',
        'title': _('数据'), # 汉化
        'type': 'List',
        'target': 'tasks',
        'children': task_data_children,
        'project_defined': False,
    }

    result['columns'] += [
        # --- Tasks ---
        {
            'id': 'id',
            'title': 'ID',
            'type': 'Number',
            'help': _('任务 ID'), # 汉化
            'target': 'tasks',
            'visibility_defaults': {'explore': True, 'labeling': False},
            'project_defined': False,
        }
    ]

    result['columns'] += [
        {
            'id': 'inner_id',
            'title': _('内部 ID'), # 汉化
            'type': 'Number',
            'help': _('当前项目的内部任务 ID，从 1 开始'), # 汉化
            'target': 'tasks',
            'visibility_defaults': {'explore': False, 'labeling': False},
            'project_defined': False,
        }
    ]

    if remove_members_schema:
        project_members = []
    else:
        project_members = project.all_members.values_list('id', flat=True)

    result['columns'] += [
        {
            'id': 'completed_at',
            'title': _('已完成'), # 汉化
            'type': 'Datetime',
            'target': 'tasks',
            'help': _('最后标注日期'), # 汉化
            'visibility_defaults': {'explore': True, 'labeling': False},
            'project_defined': False,
        },
        {
            'id': 'total_annotations',
            'title': _('标注数'), # 汉化
            'type': 'Number',
            'target': 'tasks',
            'help': _('每个任务的标注总数'), # 汉化
            'visibility_defaults': {'explore': True, 'labeling': True},
            'project_defined': False,
        },
        {
            'id': 'cancelled_annotations',
            'title': _('已取消'), # 汉化
            'type': 'Number',
            'target': 'tasks',
            'help': _('取消（跳过）的标注总数'), # 汉化
            'visibility_defaults': {'explore': True, 'labeling': False},
            'project_defined': False,
        },
        {
            'id': 'total_predictions',
            'title': _('预测数'), # 汉化
            'type': 'Number',
            'target': 'tasks',
            'help': _('每个任务的预测总数'), # 汉化
            'visibility_defaults': {'explore': True, 'labeling': False},
            'project_defined': False,
        },
        {
            'id': 'annotators',
            'title': _('标注人'), # 汉化
            'type': 'List',
            'target': 'tasks',
            'help': _('所有完成该任务的用户'), # 汉化
            **({'schema': {'items': project_members}} if not remove_members_schema else {}),
            'visibility_defaults': {'explore': True, 'labeling': False},
            'project_defined': False,
        },
        {
            'id': 'annotations_results',
            'title': _('标注结果'), # 汉化
            'type': 'String',
            'target': 'tasks',
            'help': _('叠加所有标注的标注结果'), # 汉化
            'visibility_defaults': {'explore': False, 'labeling': False},
            'project_defined': False,
        },
        {
            'id': 'annotations_ids',
            'title': _('标注 ID'), # 汉化
            'type': 'String',
            'target': 'tasks',
            'help': _('叠加所有标注的标注 ID'), # 汉化
            'visibility_defaults': {'explore': False, 'labeling': False},
            'project_defined': False,
        },
        {
            'id': 'predictions_score',
            'title': _('预测分数'), # 汉化
            'type': 'Number',
            'target': 'tasks',
            'help': _('所有任务预测的平均分数'), # 汉化
            'visibility_defaults': {'explore': False, 'labeling': False},
            'project_defined': False,
        },
        {
            'id': 'predictions_model_versions',
            'title': _('预测模型版本'), # 汉化
            'type': 'List',
            'target': 'tasks',
            'help': _('所有预测的聚合模型版本'), # 汉化
            'schema': {'items': project.get_model_versions(), 'multiple': True},
            'visibility_defaults': {'explore': False, 'labeling': False},
            'project_defined': False,
        },
        {
            'id': 'predictions_results',
            'title': _('预测结果'), # 汉化
            'type': 'String',
            'target': 'tasks',
            'help': _('叠加所有预测的预测结果'), # 汉化
            'visibility_defaults': {'explore': False, 'labeling': False},
            'project_defined': False,
        },
        {
            'id': 'file_upload',
            'title': _('上传文件名'), # 汉化
            'type': 'String',
            'target': 'tasks',
            'help': _('上传文件的文件名'), # 汉化
            'visibility_defaults': {'explore': False, 'labeling': False},
            'project_defined': False,
        },
        {
            'id': 'storage_filename',
            'title': _('存储文件名'), # 汉化
            'type': 'String',
            'target': 'tasks',
            'help': _('导入存储的文件名'), # 汉化
            'visibility_defaults': {'explore': False, 'labeling': False},
            'project_defined': False,
        },
        {
            'id': 'created_at',
            'title': _('创建时间'), # 汉化
            'type': 'Datetime',
            'target': 'tasks',
            'help': _('任务创建时间'), # 汉化
            'visibility_defaults': {'explore': False, 'labeling': False},
            'project_defined': False,
        },
        {
            'id': 'updated_at',
            'title': _('更新时间'), # 汉化
            'type': 'Datetime',
            'target': 'tasks',
            'help': _('任务更新时间'), # 汉化
            'visibility_defaults': {'explore': False, 'labeling': False},
            'project_defined': False,
        },
        {
            'id': 'updated_by',
            'title': _('更新人'), # 汉化
            'type': 'List',
            'target': 'tasks',
            'help': _('最后更新任务的用户'), # 汉化
            **({'schema': {'items': project_members}} if not remove_members_schema else {}),
            'visibility_defaults': {'explore': False, 'labeling': False},
            'project_defined': False,
        },
        {
            'id': 'avg_lead_time',
            'title': _('耗时'), # 汉化
            'type': 'Number',
            'help': _('所有标注的平均耗时（秒）'), # 汉化
            'target': 'tasks',
            'visibility_defaults': {'explore': False, 'labeling': False},
            'project_defined': False,
        },
        {
            'id': 'draft_exists',
            'title': _('草稿'), # 汉化
            'type': 'Boolean',
            'help': _('如果任务至少存在一个草稿，则为真'), # 汉化
            'target': 'tasks',
            'visibility_defaults': {'explore': False, 'labeling': False},
            'project_defined': False,
        },
    ]

    result['columns'].append(data_root)

    return result


def get_prepare_params(request, project):
    """This function extract prepare_params from
    * view_id if it's inside of request data
    * selectedItems, filters, ordering if they are in request and there is no view id
    """
    # use filters and selected items from view
    view_id = int_from_request(request.GET, 'view', 0) or int_from_request(request.data, 'view', 0)
    if view_id > 0:
        view = get_object_or_404(View, pk=view_id)
        if view.project.pk != project.pk:
            raise DataManagerException('Project and View mismatch')
        prepare_params = view.get_prepare_tasks_params(add_selected_items=True)
        prepare_params.request = request

    # use filters and selected items from request if it's specified
    else:
        # query arguments from url
        if 'query' in request.GET:
            data = json.loads(unquote(request.GET['query']))
        # data payload from body
        else:
            data = request.data

        selected = data.get('selectedItems', {'all': True, 'excluded': []})
        if not isinstance(selected, dict):
            if isinstance(selected, str):
                # try to parse JSON string
                try:
                    selected = json.loads(selected)
                except Exception as e:
                    logger.error(f'Error parsing selectedItems: {e}')
                    raise DataManagerException(
                        'selectedItems must be JSON encoded string for dict: {"all": [true|false], '
                        '"excluded | included": [...task_ids...]}. '
                        f'Found: {selected}'
                    )
            else:
                raise DataManagerException(
                    'selectedItems must be dict: {"all": [true|false], '
                    '"excluded | included": [...task_ids...]}. '
                    f'Found type: {type(selected)} with value: {selected}'
                )
        filters = data.get('filters', None)
        ordering = data.get('ordering', [])
        prepare_params = PrepareParams(
            project=project.id, selectedItems=selected, data=data, filters=filters, ordering=ordering, request=request
        )
    return prepare_params


def get_prepared_queryset(request, project):
    prepare_params = get_prepare_params(request, project)
    queryset = Task.prepared.only_filtered(prepare_params=prepare_params)
    return queryset


def evaluate_predictions(tasks):
    """
    Call the given ML backend to retrieve predictions with the task queryset as an input.
    If backend is not specified, we'll assume the tasks' project only has one associated
    ML backend, and use that backend.
    """
    if not tasks:
        return

    project = tasks[0].project

    backend = project.ml_backend

    if backend:
        return backend.predict_tasks(tasks=tasks)


def filters_ordering_selected_items_exist(data):
    return data.get('filters') or data.get('ordering') or data.get('selectedItems')


def custom_filter_expressions(*args, **kwargs):
    pass


# 修正：同样将 *_ 改为 *args，避免覆盖翻译函数 _
def preprocess_filter(_filter, *args):
    return _filter


def preprocess_field_name(raw_field_name, project) -> Tuple[str, bool]:
    """Transform a field name (as specified in the datamanager views endpoint) to
    a django ORM field name. Also handle dotted accesses to task.data.

    Edit with care; it's critical that this function not be changed in ways that
    introduce vulnerabilities in the vein of the ORM Leak (see #5012). In particular
    it is not advisable to use `replace` or other calls that replace all instances
    of a string within this function.

    Returns: Django ORM field name: str, Sort is ascending: bool
    """

    field_name = raw_field_name
    ascending = True

    # Descending marker `-` may come at the beginning of the string
    if field_name.startswith('-'):
        ascending = False
        field_name = field_name[1:]

    # For security reasons, these must only be removed when they fall at the beginning of the string (or after `-`).
    optional_prefixes = ['filter:', 'tasks:']
    for prefix in optional_prefixes:
        if field_name.startswith(prefix):
            field_name = field_name[len(prefix) :]

    # Descending marker may also come after other prefixes. Double negative is not allowed.
    if ascending and field_name.startswith('-'):
        ascending = False
        field_name = field_name[1:]

    if field_name.startswith('data.'):
        # process as $undefined$ only if real_name is from labeling config, not from task.data
        real_name = field_name.replace('data.', '')
        common_data_columns = project.summary.common_data_columns
        real_name_suitable = (
            # there is only one object tag in labeling config
            # and requested filter name == value from object tag
            len(project.data_types.keys()) == 1
            and real_name in project.data_types.keys()
            # file was uploaded before labeling config is set, `data.data` is system predefined name
            or len(project.data_types.keys()) == 0
            and real_name == 'data'
        )
        if (
            real_name_suitable
            # common data columns are not None
            and common_data_columns
            # $undefined$ is in common data columns, in all tasks
            and settings.DATA_UNDEFINED_NAME in common_data_columns
        ):
            field_name = f'data__{settings.DATA_UNDEFINED_NAME}'
        else:
            field_name = field_name.replace('data.', 'data__')
    return field_name, ascending


def intersperse(items: Iterable, separator: Any) -> list:
    """
    Create a list with a separator between each item in the passed iterable `items`

    for example, intersperse(['one', 'two', 'three'], 0) == ['one', 0, 'two', 0, 'three']
    """

    output = []
    for item in items:
        output.append(item)
        output.append(separator)
    # if there are no items, there will be no last separator to remove
    if output:
        output.pop()
    return output