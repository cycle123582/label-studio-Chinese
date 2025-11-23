# Common storage schema properties following OpenAPI 3.0 specification
_common_storage_schema_properties = {
    'title': {'type': 'string', 'description': 'Storage title', 'maxLength': 2048},
    'description': {'type': 'string', 'description': 'Storage description'},
    'project': {'type': 'integer', 'description': 'Project ID'},
    'container': {'type': 'string', 'description': 'Azure blob container'},
    'prefix': {'type': 'string', 'description': 'Azure blob prefix name'},
    'account_name': {'type': 'string', 'description': 'Azure Blob account name'},
    'account_key': {'type': 'string', 'description': 'Azure Blob account key'},
}

# Azure Blob import storage schema
_azure_blob_import_storage_schema = {
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
        **_common_storage_schema_properties,
    },
    'required': [],
}

# Azure Blob import storage schema with ID
_azure_blob_import_storage_schema_with_id = {
    'type': 'object',
    'properties': {
        'id': {'type': 'integer', 'description': 'Storage ID. If set, storage with specified ID will be updated'},
        **_azure_blob_import_storage_schema['properties'],
    },
    'required': [],
}

# Azure Blob export storage schema
_azure_blob_export_storage_schema = {
    'type': 'object',
    'properties': {
        'can_delete_objects': {'type': 'boolean', 'description': 'Deletion from storage enabled', 'default': False},
        **_common_storage_schema_properties,
    },
    'required': [],
}

# Azure Blob export storage schema with ID
_azure_blob_export_storage_schema_with_id = {
    'type': 'object',
    'properties': {
        'id': {'type': 'integer', 'description': 'Storage ID. If set, storage with specified ID will be updated'},
        **_azure_blob_export_storage_schema['properties'],
    },
    'required': [],
}
