# Common GCS storage schema properties following OpenAPI 3.0 specification
_common_gcs_storage_schema_properties = {
    'title': {'type': 'string', 'description': 'Storage title', 'maxLength': 2048},
    'description': {'type': 'string', 'description': 'Storage description'},
    'project': {'type': 'integer', 'description': 'Project ID'},
    'bucket': {'type': 'string', 'description': 'GCS bucket name'},
    'prefix': {'type': 'string', 'description': 'GCS bucket prefix'},
    'google_application_credentials': {
        'type': 'string',
        'description': 'The content of GOOGLE_APPLICATION_CREDENTIALS json file. Check official Google Cloud Authentication documentation for more details.',
    },
    'google_project_id': {'type': 'string', 'description': 'Google project ID'},
}

# GCS import storage schema
_gcs_import_storage_schema = {
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
        'presign': {'type': 'boolean', 'description': 'Presign URLs for direct download', 'default': True},
        'presign_ttl': {'type': 'integer', 'description': 'Presign TTL in minutes', 'default': 1},
        **_common_gcs_storage_schema_properties,
    },
    'required': [],
}

# GCS import storage schema with ID
_gcs_import_storage_schema_with_id = {
    'type': 'object',
    'properties': {
        'id': {'type': 'integer', 'description': 'Storage ID. If set, storage with specified ID will be updated'},
        **_gcs_import_storage_schema['properties'],
    },
    'required': [],
}

# GCS export storage schema
_gcs_export_storage_schema = {
    'type': 'object',
    'properties': {
        'can_delete_objects': {'type': 'boolean', 'description': 'Deletion from storage enabled.', 'default': False},
        **_common_gcs_storage_schema_properties,
    },
    'required': [],
}

# GCS export storage schema with ID
_gcs_export_storage_schema_with_id = {
    'type': 'object',
    'properties': {
        'id': {'type': 'integer', 'description': 'Storage ID. If set, storage with specified ID will be updated'},
        **_gcs_export_storage_schema['properties'],
    },
    'required': [],
}
