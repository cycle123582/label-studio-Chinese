---
title: HyperText
type: tags
order: 303
meta_title: Hypertext Tags for Hypertext Markup (HTML)
meta_description: Label Studio Hypertext Tags customize Label Studio for hypertext markup (HTML) for machine learning and data science projects.
---

The `HyperText` tag displays hypertext markup for labeling. Use for labeling HTML-encoded text and webpages for NER and NLP projects.

Use with the following data types: HTML.

{% insertmd includes/tags/hypertext.md %}

### Example

Labeling configuration to label HTML content

```html
<View>
  <HyperText name="text-1" value="$text" />
  <Labels name="parts" toName="text-1">
    <Label value="Caption" />
    <Label value="Article" />
    <Label value="Author" />
  </Labels>
</View>
```
### Example
```html
<View>
  <HyperText name="p1">
    <p>Some explanations <em>with style</em></p>
  </HyperText>
</View>
```
