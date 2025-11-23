# Common Redis storage schema properties following OpenAPI 3.0 specification
_common_redis_storage_schema_properties = {
    'title': {'type': 'string', 'description': 'Storage title', 'maxLength': 2048},
    'description': {'type': 'string', 'description': 'Storage description'},
    'project': {'type': 'integer', 'description': 'Project ID'},
    'path': {'type': 'string', 'description': 'Storage prefix (optional)'},
    'host': {'type': 'string', 'description': 'Server Host IP (optional)'},
    'port': {'type': 'string', 'description': 'Server Port (optional)'},
    'password': {'type': 'string', 'description': 'Server Password (optional)'},
}

# Redis import storage schema
_redis_import_storage_schema = {
    'type': 'object',
    'properties': {
        'regex_filter': {
            'type': 'string',
            'description': 'Cloud storage regex for filtering objects. You must specify it otherwise no objects will be imported.',
        },
        'use_blob_urls': {
            'type': 'boolean',
            'description': 'Interpret objects as BLOBs and generate URLs. For example, if your bucket contains images, you can use this option to generate URLs for these images. If set to False, it will read the content of the file and load it into Label Studio.',
            'default': False,
        },
        **_common_redis_storage_schema_properties,
    },
    'required': [],
}

# Redis import storage schema with ID
_redis_import_storage_schema_with_id = {
    'type': 'object',
    'properties': {
        'id': {'type': 'integer', 'description': 'Storage ID. If set, storage with specified ID will be updated'},
        **_redis_import_storage_schema['properties'],
    },
    'required': [],
}

# Redis export storage schema
_redis_export_storage_schema = {
    'type': 'object',
    'properties': {
        'db': {'type': 'integer', 'description': 'Database ID of database to use'},
        'can_delete_objects': {'type': 'boolean', 'description': 'Deletion from storage enabled.', 'default': False},
        **_common_redis_storage_schema_properties,
    },
    'required': [],
}

# Redis export storage schema with ID
_redis_export_storage_schema_with_id = {
    'type': 'object',
    'properties': {
        'id': {'type': 'integer', 'description': 'Storage ID. If set, storage with specified ID will be updated'},
        **_redis_export_storage_schema['properties'],
    },
    'required': [],
}
