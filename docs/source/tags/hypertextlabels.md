---
title: HyperTextLabels
type: tags
order: 408
meta_title: Hypertext Label Tag to Create Labeled Hypertext (HTML)
meta_description: Customize Label Studio with the HyperTextLabels tag to label hypertext (HTML) for machine learning and data science projects.
---

The `HyperTextLabels` tag creates labeled hyper text (HTML). Use with the HyperText object tag to annotate HTML text or HTML elements for named entity recognition tasks.

Use with the following data types: HTML.

{% insertmd includes/tags/hypertextlabels.md %}

### Example

Basic semantic text labeling configuration

```html
<View>
  <HyperTextLabels name="labels" toName="ht">
    <Label value="Header" />
    <Label value="Body Text" />
  </HyperTextLabels>
  <HyperText name="ht" value="$html" />
</View>
```
