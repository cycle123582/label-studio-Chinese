# Common S3 storage schema properties following OpenAPI 3.0 specification
_common_s3_storage_schema_properties = {
    'title': {'type': 'string', 'description': 'Storage title', 'maxLength': 2048},
    'description': {'type': 'string', 'description': 'Storage description'},
    'project': {'type': 'integer', 'description': 'Project ID'},
    'bucket': {'type': 'string', 'description': 'S3 bucket name'},
    'prefix': {'type': 'string', 'description': 'S3 bucket prefix'},
    'aws_access_key_id': {'type': 'string', 'description': 'AWS_ACCESS_KEY_ID'},
    'aws_secret_access_key': {'type': 'string', 'description': 'AWS_SECRET_ACCESS_KEY'},
    'aws_session_token': {'type': 'string', 'description': 'AWS_SESSION_TOKEN'},
    'aws_sse_kms_key_id': {'type': 'string', 'description': 'AWS SSE KMS Key ID'},
    'region_name': {'type': 'string', 'description': 'AWS Region'},
    's3_endpoint': {'type': 'string', 'description': 'S3 Endpoint'},
}

# S3 import storage schema
_s3_import_storage_schema = {
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
        'presign': {'type': 'boolean', 'description': 'Presign URLs for download', 'default': True},
        'presign_ttl': {'type': 'integer', 'description': 'Presign TTL in minutes', 'default': 1},
        'recursive_scan': {'type': 'boolean', 'description': 'Scan recursively'},
        **_common_s3_storage_schema_properties,
    },
    'required': [],
}

# S3 import storage schema with ID
_s3_import_storage_schema_with_id = {
    'type': 'object',
    'properties': {
        'id': {'type': 'integer', 'description': 'Storage ID. If set, storage with specified ID will be updated'},
        **_s3_import_storage_schema['properties'],
    },
    'required': [],
}

# S3 export storage schema
_s3_export_storage_schema = {
    'type': 'object',
    'properties': {
        'can_delete_objects': {'type': 'boolean', 'description': 'Deletion from storage enabled.', 'default': False},
        **_common_s3_storage_schema_properties,
    },
    'required': [],
}

# S3 export storage schema with ID
_s3_export_storage_schema_with_id = {
    'type': 'object',
    'properties': {
        'id': {'type': 'integer', 'description': 'Storage ID. If set, storage with specified ID will be updated'},
        **_s3_export_storage_schema['properties'],
    },
    'required': [],
}
