### Parameters

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | Name of the group of choices |
| toName | <code>string</code> |  | Name of the data item that you want to label |
| [choice] | <code>single</code> \| <code>single-radio</code> \| <code>multiple</code> | <code>single</code> | Single or multi-class classification |
| [showInline] | <code>boolean</code> | <code>false</code> | Show choices in the same visual line |
| [required] | <code>boolean</code> | <code>false</code> | Validate whether a choice has been selected |
| [requiredMessage] | <code>string</code> |  | Show a message if validation fails |
| [visibleWhen] | <code>region-selected</code> \| <code>no-region-selected</code> \| <code>choice-selected</code> \| <code>choice-unselected</code> |  | Control visibility of the choices. Can also be used with the `when*` parameters below to narrow down visibility |
| [whenTagName] | <code>string</code> |  | Use with `visibleWhen`. Narrow down visibility by name of the tag. For regions, use the name of the object tag, for choices, use the name of the `choices` tag |
| [whenLabelValue] | <code>string</code> |  | Use with `visibleWhen="region-selected"`. Narrow down visibility by label value. Multiple values can be separated with commas |
| [whenChoiceValue] | <code>string</code> |  | Use with `visibleWhen` (`"choice-selected"` or `"choice-unselected"`) and `whenTagName`, both are required. Narrow down visibility by choice value. Multiple values can be separated with commas |
| [perRegion] | <code>boolean</code> |  | Use this tag to select a choice for a specific region instead of the entire task |
| [perItem] | <code>boolean</code> |  | Use this tag to select a choice for a specific item inside the object instead of the whole object |
| [value] | <code>string</code> |  | Task data field containing a list of dynamically loaded choices (see example below) |
| [allowNested] | <code>boolean</code> |  | Allow to use `children` field in dynamic choices to nest them. Submitted result will contain array of arrays, every item is a list of values from topmost parent choice down to selected one. |
| [layout] | <code>select</code> \| <code>inline</code> \| <code>vertical</code> |  | Layout of the choices: `select` for dropdown/select box format, `inline` for horizontal single row display, `vertical` for vertically stacked display (default) |

