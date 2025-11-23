### Parameters

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the element |
| toName | <code>string</code> | Name of the video element |

### Result parameters

| Name | Type | Description |
| --- | --- | --- |
| value | <code>Object</code> |  |
| value.ranges | <code>Array.&lt;object&gt;</code> | Array of ranges, each range is an object with `start` and `end` properties. One range per region. |
| [value.timelinelabels] | <code>Array.&lt;string&gt;</code> | Regions are created by `TimelineLabels`, and the corresponding label is listed here. |

### Example JSON
```json
{
  "value": {
    "ranges": [{"start": 3, "end": 5}],
    "timelinelabels": ["Moving"]
  }
}
```

