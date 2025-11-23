### Parameters

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| column | <code>string</code> |  | column name or index |
| [legend] | <code>string</code> |  | display name of the channel |
| [units] | <code>string</code> |  | display units name |
| [displayFormat] | <code>string</code> |  | format string for the values, uses d3-format:<br/>        `[,][.precision][f\|%]`<br/>        `,` - group thousands with separator (from locale): `,` (12345.6 -> 12,345.6) `,.2f` (12345.6 -> 12,345.60)<br/>        `.precision` - precision for `f\|%` type, significant digits for empty type:<br/>                     `.3f` (12.3456 -> 12.345, 1000 -> 1000.000)<br/>                     `.3` (12.3456 -> 12.3, 1.2345 -> 1.23, 12345 -> 1.23e+4)<br/>        `f` - treat as float, default precision is .6: `f` (12 -> 12.000000) `.2f` (12 -> 12.00) `.0f` (12.34 -> 12)<br/>        `%` - treat as percents and format accordingly: `%.0` (0.128 -> 13%) `%.1` (1.2345 -> 123.4%) |
| [height] | <code>number</code> | <code>200</code> | height of the plot |
| [strokeColor] | <code>string</code> | <code>&quot;#f48a42&quot;</code> | plot stroke color, expects hex value |
| [strokeWidth] | <code>number</code> | <code>1</code> | plot stroke width |
| [markerColor] | <code>string</code> | <code>&quot;#f48a42&quot;</code> | plot stroke color, expects hex value |
| [markerSize] | <code>number</code> | <code>0</code> | plot stroke width |
| [markerSymbol] | <code>number</code> | <code>circle</code> | plot stroke width |
| [timeRange] | <code>string</code> |  | data range of x-axis / time axis |
| [dataRange] | <code>string</code> |  | data range of y-axis / data axis |
| [showAxis] | <code>string</code> |  | show or bide both axis |
| [fixedScale] | <code>boolean</code> |  | if false current view scales to fit only displayed values; if given overwrites TimeSeries' fixedScale |

