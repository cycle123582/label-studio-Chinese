from users.serializers import HotkeysSerializer


class TestHotkeysSerializer:
    """Tests for the HotkeysSerializer"""

    def test_valid_data(self):
        """
        Test serializer accepts valid hotkeys data.

        Validates that the serializer correctly processes a dictionary of hotkeys
        with proper action key format (namespace:action) and valid key bindings.
        """
        valid_hotkeys = {
            'editor:save': {'key': 'ctrl+s', 'active': True},
            'editor:open': {'key': 'ctrl+o', 'active': False},
            'editor:cut': {'key': 'ctrl+x'},
            'navigation:home': {'key': 'alt+h', 'active': True},
        }

        serializer_data = {'custom_hotkeys': valid_hotkeys}
        serializer = HotkeysSerializer(data=serializer_data)

        assert serializer.is_valid()

    def test_invalid_format_not_dict(self):
        """
        Test serializer rejects non-dictionary custom_hotkeys.

        Validates that the serializer enforces the custom_hotkeys field
        to be a dictionary type and rejects other data types like lists.
        """
        data = {'custom_hotkeys': ['not a dictionary']}
        serializer = HotkeysSerializer(data=data)

        assert not serializer.is_valid()
        assert 'custom_hotkeys' in serializer.errors

    def test_invalid_action_key_format(self):
        """
        Test serializer rejects action keys without proper format.

        Validates that action keys must follow the namespace:action format
        and rejects keys that don't contain the required colon separator.
        """
        invalid_data = {'custom_hotkeys': {'editorsave': {'key': 'ctrl+s'}}}  # Missing colon
        serializer = HotkeysSerializer(data=invalid_data)

        assert not serializer.is_valid()
        assert 'custom_hotkeys' in serializer.errors

    def test_empty_action_key(self):
        """
        Test serializer rejects empty action keys.

        Validates that action keys cannot be empty strings and must
        contain meaningful namespace and action identifiers.
        """
        invalid_data = {'custom_hotkeys': {'': {'key': 'ctrl+s'}}}
        serializer = HotkeysSerializer(data=invalid_data)

        assert not serializer.is_valid()
        assert 'custom_hotkeys' in serializer.errors

    def test_missing_key_in_hotkey_data(self):
        """
        Test serializer rejects hotkey data without required 'key' field.

        Validates that each hotkey configuration must include a 'key' field
        specifying the keyboard shortcut binding.
        """
        invalid_data = {'custom_hotkeys': {'editor:save': {'active': True}}}  # Missing 'key'
        serializer = HotkeysSerializer(data=invalid_data)

        assert not serializer.is_valid()
        assert 'custom_hotkeys' in serializer.errors

    def test_invalid_key_value(self):
        """
        Test serializer rejects invalid key values.

        Validates that the 'key' field cannot be empty and must contain
        a valid keyboard shortcut string representation.
        """
        invalid_data = {'custom_hotkeys': {'editor:save': {'key': ''}}}  # Empty key
        serializer = HotkeysSerializer(data=invalid_data)

        assert not serializer.is_valid()
        assert 'custom_hotkeys' in serializer.errors

    def test_invalid_active_flag(self):
        """
        Test serializer rejects non-boolean active flags.

        Validates that the optional 'active' field must be a boolean value
        when present, rejecting string or other non-boolean types.
        """
        invalid_data = {'custom_hotkeys': {'editor:save': {'key': 'ctrl+s', 'active': 'yes'}}}  # Should be boolean
        serializer = HotkeysSerializer(data=invalid_data)

        assert not serializer.is_valid()
        assert 'custom_hotkeys' in serializer.errors
