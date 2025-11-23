# Common local files storage schema properties following OpenAPI 3.0 specification
_common_storage_schema_properties = {
    'title': {'type': 'string', 'description': 'Storage title', 'maxLength': 2048},
    'description': {'type': 'string', 'description': 'Storage description'},
    'project': {'type': 'integer', 'description': 'Project ID'},
    'path': {'type': 'string', 'description': 'Path to local directory'},
    'regex_filter': {'type': 'string', 'description': 'Regex for filtering objects'},
    'use_blob_urls': {
        'type': 'boolean',
        'description': 'Interpret objects as BLOBs and generate URLs. For example, if your directory contains images, you can use this option to generate URLs for these images. If set to False, it will read the content of the file and load it into Label Studio.',
        'default': False,
    },
}

# Local files import storage schema
_local_files_import_storage_schema = {
    'type': 'object',
    'properties': _common_storage_schema_properties,
    'required': [],
}

# Local files import storage schema with ID
_local_files_import_storage_schema_with_id = {
    'type': 'object',
    'properties': {
        'id': {'type': 'integer', 'description': 'Storage ID. If set, storage with specified ID will be updated'},
        **_local_files_import_storage_schema['properties'],
    },
    'required': [],
}

# Local files export storage schema
_local_files_export_storage_schema = {
    'type': 'object',
    'properties': _common_storage_schema_properties,
    'required': [],
}

# Local files export storage schema with ID
_local_files_export_storage_schema_with_id = {
    'type': 'object',
    'properties': {
        'id': {'type': 'integer', 'description': 'Storage ID. If set, storage with specified ID will be updated'},
        **_local_files_export_storage_schema['properties'],
    },
    'required': [],
}
