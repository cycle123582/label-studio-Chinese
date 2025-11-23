---
title: Filter
type: tags
order: 502
meta_title: Filter Tag for Filter Search
meta_description: Customize Label Studio with the Filter tag to filter labels to accelerate labeling for machine learning and data science projects.
---

Use the Filter tag to add a filter search for a large number of labels or choices. Use with the Labels tag or Choices tag.

{% insertmd includes/tags/filter.md %}

### Example

Add a filter to labels for a named entity recognition task

```html
<View>
  <Filter name="filter" toName="ner"
          hotkey="shift+f" minlength="0"
          placeholder="Filter" />
  <Labels name="ner" toName="text" showInline="false">
    <Label value="Person" />
    <Label value="Organization" />
  </Labels>
  <Text name="text" value="$text" />
</View>
```
