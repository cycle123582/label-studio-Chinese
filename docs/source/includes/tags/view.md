### Parameters

| Param | Type | Description |
| --- | --- | --- |
| display | <code>block</code> \| <code>inline</code> |  |
| [style] | <code>string</code> | CSS style string |
| [className] | <code>string</code> | Class name of the CSS style to apply. Use with the Style tag |
| [idAttr] | <code>string</code> | Unique ID attribute to use in CSS |
| [visibleWhen] | <code>region-selected</code> \| <code>choice-selected</code> \| <code>no-region-selected</code> \| <code>choice-unselected</code> | Control visibility of the content. Can also be used with the `when*` parameters below to narrow visibility |
| [whenTagName] | <code>string</code> | Use with `visibleWhen`. Narrow down visibility by tag name. For regions, use the name of the object tag, for choices, use the name of the `choices` tag |
| [whenLabelValue] | <code>string</code> | Use with `visibleWhen="region-selected"`. Narrow down visibility by label value. Multiple values can be separated with commas |
| [whenChoiceValue] | <code>string</code> | Use with `visibleWhen` (`"choice-selected"` or `"choice-unselected"`) and `whenTagName`, both are required. Narrow down visibility by choice value. Multiple values can be separated with commas |

