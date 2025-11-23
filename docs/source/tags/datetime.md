---
title: DateTime
type: tags
order: 405
---

The DateTime tag adds date and time selection to the labeling interface. Use this tag to add a date, timestamp, month, or year to an annotation.

Use with the following data types: audio, image, HTML, paragraph, text, time series, video

{% insertmd includes/tags/datetime.md %}

### Example
```html
<View>
  <Text name="txt" value="$text" />
  <DateTime name="datetime" toName="txt" only="date" />
</View>
```
