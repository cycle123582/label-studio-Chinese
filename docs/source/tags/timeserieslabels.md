---
title: TimeSeriesLabels
type: tags
order: 428
meta_title: Time Series Label Tag for Labeling Time Series Data
meta_description: Customize Label Studio for with the TimeSeriesLabel tag to label time series data for machine learning and data science projects.
---

The `TimeSeriesLabels` tag is used to create a labeled time range.

Use with the following data types: time series.

{% insertmd includes/tags/timeserieslabels.md %}

### Example

Basic labeling configuration to apply labels to identified regions of a time series with one channel

```html
<View>
  <TimeSeriesLabels name="label" toName="ts">
      <Label value="Run"/>
      <Label value="Walk"/>
  </TimeSeriesLabels>

  <TimeSeries name="ts" value="$csv" valueType="url">
     <Channel column="first_column"/>
  </TimeSeries>
</View>
```
