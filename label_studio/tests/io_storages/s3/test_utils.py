from unittest.mock import patch

import pytest
from django.test import override_settings
from io_storages.s3.utils import S3StorageError, catch_and_reraise_from_none


@override_settings(S3_TRUSTED_STORAGE_DOMAINS=['trusted-domain.com'])
def test_catch_and_reraise_from_none_with_untrusted_domain():
    class TestClass:
        s3_endpoint = 'http://untrusted-domain.com'

    instance = TestClass()

    @catch_and_reraise_from_none
    def function_to_test(self):
        raise Exception('Original Exception')

    with patch('io_storages.s3.utils.extractor.extract_urllib') as mock_extract:
        mock_extract.return_value.registered_domain = 'untrusted-domain.com'
        with pytest.raises(S3StorageError) as excinfo:
            function_to_test(instance)
        assert 'Debugging info is not available for s3 endpoints on domain: untrusted-domain.com' in str(excinfo.value)


@override_settings(S3_TRUSTED_STORAGE_DOMAINS=['trusted-domain.com'])
def test_catch_and_reraise_from_none_with_trusted_domain():
    class TestClass:
        s3_endpoint = 'http://trusted-domain.com'

    instance = TestClass()

    @catch_and_reraise_from_none
    def function_to_test(self):
        raise Exception('Original Exception')

    with patch('io_storages.s3.utils.extractor.extract_urllib') as mock_extract:
        mock_extract.return_value.registered_domain = 'trusted-domain.com'
        with pytest.raises(Exception) as excinfo:
            function_to_test(instance)
        assert 'Original Exception' in str(excinfo.value)
