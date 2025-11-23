### Parameters

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | Name of the element |
| value | <code>string</code> |  | Data field containing text or a UR |
| [valueType] | <code>url</code> \| <code>text</code> | <code>text</code> | Whether the text is stored directly in uploaded data or needs to be loaded from a URL |
| [saveTextResult] | <code>yes</code> \| <code>no</code> |  | Whether to store labeled text along with the results. By default, doesn't store text for `valueType=url` |
| [encoding] | <code>none</code> \| <code>base64</code> \| <code>base64unicode</code> |  | How to decode values from encoded strings |
| [selectionEnabled] | <code>boolean</code> | <code>true</code> | Enable or disable selection |
| [highlightColor] | <code>string</code> |  | Hex string with highlight color, if not provided uses the labels color |
| [showLabels] | <code>boolean</code> |  | Whether or not to show labels next to the region; unset (by default) — use editor settings; true/false — override settings |
| [granularity] | <code>symbol</code> \| <code>word</code> \| <code>sentence</code> \| <code>paragraph</code> |  | Control region selection granularity |

### Result parameters

| Name | Type | Description |
| --- | --- | --- |
| value | <code>Object</code> |  |
| value.start | <code>string</code> | position of the start of the region in characters |
| value.end | <code>string</code> | position of the end of the region in characters |
| [value.text] | <code>string</code> | text content of the region, can be skipped |

### Example JSON
```json
{
  "value": {
    "start": 2,
    "end": 81,
    "labels": ["Car"]
  }
}
```

