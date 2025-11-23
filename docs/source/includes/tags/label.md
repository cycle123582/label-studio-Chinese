### Parameters

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>string</code> |  | Value of the label |
| [selected] | <code>boolean</code> | <code>false</code> | Whether to preselect this label |
| [maxUsages] | <code>number</code> |  | Maximum number of times this label can be used per task |
| [hint] | <code>string</code> |  | Hint for label on hover |
| [hotkey] | <code>string</code> |  | Hotkey to use for the label. Automatically generated if not specified |
| [alias] | <code>string</code> |  | Label alias |
| [showAlias] | <code>boolean</code> | <code>false</code> | Whether to show alias inside label text |
| [aliasStyle] | <code>string</code> | <code>&quot;opacity:0.6&quot;</code> | CSS style for the alias |
| [size] | <code>string</code> | <code>&quot;medium&quot;</code> | Size of text in the label |
| [background] | <code>string</code> | <code>&quot;#36B37E&quot;</code> | Background color of an active label in hexadecimal |
| [selectedColor] | <code>string</code> | <code>&quot;#ffffff&quot;</code> | Color of text in an active label in hexadecimal |
| [granularity] | <code>symbol</code> \| <code>word</code> |  | Set control based on symbol or word selection (only for Text) |
| [html] | <code>string</code> |  | HTML code is used to display label button instead of raw text provided by `value` (should be properly escaped) |
| [category] | <code>int</code> |  | Category is used in the export (in label-studio-converter lib) to make an order of labels for YOLO and COCO |

