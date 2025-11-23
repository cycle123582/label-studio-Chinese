### Parameters

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | Name of the element |
| value | <code>string</code> |  | Key used to look up the data, either URLs for your time-series if valueType=url, otherwise expects JSON |
| [valueType] | <code>url</code> \| <code>json</code> | <code>url</code> | Format of time series data provided. If set to "url" then Label Studio loads value references inside `value` key, otherwise it expects JSON. |
| [sync] | <code>string</code> |  | Object name to sync with. |
| [cursorColor] | <code>string</code> |  | Color of the playback cursors used in sync (hex or any SVG-compatible color string) |
| [timeColumn] | <code>string</code> |  | Column name or index that provides temporal values. If your time series data has no temporal column then one is automatically generated. |
| [timeFormat] | <code>string</code> |  | Pattern used to parse values inside timeColumn, parsing is provided by d3, and follows `strftime` implementation |
| [timeDisplayFormat] | <code>string</code> |  | Format used to display temporal value. Can be a number or a date. If a temporal column is a date, use strftime to format it. If it's a number, use [d3 number](https://github.com/d3/d3-format#locale_format) formatting. |
| [durationDisplayFormat] | <code>string</code> |  | Format used to display temporal duration value for brush range. If the temporal column is a date, use strftime to format it. If it's a number, use [d3 number](https://github.com/d3/d3-format#locale_format) formatting. |
| [sep] | <code>string</code> | <code>&quot;,&quot;</code> | Separator for your CSV file. |
| [overviewChannels] | <code>string</code> |  | Comma-separated list of channel names or indexes displayed in overview. |
| [overviewWidth] | <code>string</code> | <code>&quot;25%&quot;</code> | Default width of overview window in percents |
| [fixedScale] | <code>boolean</code> | <code>false</code> | Whether to scale y-axis to the maximum to fit all the values. If false, current view scales to fit only the displayed values. |

