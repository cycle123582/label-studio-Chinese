---
title: Label
type: tags
order: 411
meta_title: Label Tag for Single Label Tags
meta_description: Customize Label Studio with the Label tag to assign a single label to regions in a task for machine learning and data science projects.
---

The `Label` tag represents a single label. Use with the `Labels` tag, including `BrushLabels`, `EllipseLabels`, `HyperTextLabels`, `KeyPointLabels`, and other `Labels` tags to specify the value of a specific label.

{% insertmd includes/tags/label.md %}

### Example

Basic named entity recognition labeling configuration for text

```html
<View>
  <Labels name="type" toName="txt-1">
    <Label alias="B" value="Brand" />
    <Label alias="P" value="Product" />
  </Labels>
  <Text name="txt-1" value="$text" />
</View>
```
