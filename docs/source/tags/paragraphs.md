---
title: Paragraphs
type: tags
order: 306
meta_title: Paragraph Tags for Paragraphs
meta_description: Customize Label Studio with the Paragraphs tag to annotate paragraphs for NLP and NER machine learning and data science projects.
---

The `Paragraphs` tag displays paragraphs of text on the labeling interface. Use to label dialogue transcripts for NLP and NER projects.
The `Paragraphs` tag expects task data formatted as an array of objects like the following:
[{ $nameKey: "Author name", $textKey: "Text" }, ... ]

Use with the following data types: text.

{% insertmd includes/tags/paragraphs.md %}

### Example

Labeling configuration to label paragraph regions of text containing dialogue

```html
<View>
  <Paragraphs name="dialogue-1" value="$dialogue" layout="dialogue" />
  <ParagraphLabels name="importance" toName="dialogue-1">
    <Label value="Important content"></Label>
    <Label value="Random talk"></Label>
  </ParagraphLabels>
</View>
```
### Example

Paragraphs with audio

```html
<View>
  <Paragraphs audioUrl="$audio" value="$para" name="paragraphs"
              layout="dialogue" textKey="text" nameKey="author"
              showPlayer="true"
              />

  <Choices name="choices" toName="paragraphs" choice="multiple">
      <Choice value="Good quality"/>
      <Choice value="Fast speech"/>
  </Choices>
</View>

<!-- {"data": {
  "para": [
    {"text": "test 1", "author": "A", "start": 0.0, "end": 1.0},
    {"text": "test 2", "author": "B", "start": 1.0, "end": 2.0},
    {"text": "test 3", "author": "A", "start": 2.0, "end": 3.0}
  ],
  "audio": "/static/samples/game.wav"
}}
-->
```
