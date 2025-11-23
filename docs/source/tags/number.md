---
title: Number
type: tags
order: 414
meta_title: Number Tag to Numerically Classify
meta_description: Customize Label Studio with the Number tag to numerically classify tasks in your machine learning and data science projects.
---

The Number tag supports numeric classification. Use to classify tasks using numbers.

Use with the following data types: audio, image, HTML, paragraphs, text, time series, video

{% insertmd includes/tags/number.md %}

### Example

Basic labeling configuration for numeric classification of text

```html
<View>
  <Text name="txt" value="$text" />
  <Number name="number" toName="txt" max="10" />
</View>
```
