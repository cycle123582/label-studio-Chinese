---
title: ParagraphLabels
type: tags
order: 416
meta_title: Paragraph Label Tag for Paragraph Labels
meta_description: Customize Label Studio with paragraph labels for machine learning and data science projects.
---

The `ParagraphLabels` tag creates labeled paragraphs. Use with the `Paragraphs` tag to label a paragraph of text.

Use with the following data types: paragraphs.

{% insertmd includes/tags/paragraphlabels.md %}

### Example

Basic labeling configuration to label paragraphs

```html
<View>
  <ParagraphLabels name="labels" toName="prg">
    <Label value="Statement" />
    <Label value="Question" />
  </ParagraphLabels>
  <Paragraphs name="prg" value="$dialogue" layout="dialogue" />
</View>
```
