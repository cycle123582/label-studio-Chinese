---
title: TextArea
type: tags
order: 427
meta_title: Textarea Tag for Text areas
meta_description: Customize Label Studio with the TextArea tag to support audio transcription, image captioning, and OCR tasks for machine learning and data science projects.
---

The `TextArea` tag is used to display a text area for user input. Use for transcription, paraphrasing, or captioning tasks.

Use with the following data types: audio, image, HTML, paragraphs, text, time series, video.

{% insertmd includes/tags/textarea.md %}

### Example

Basic labeling configuration to display only a text area

```html
<View>
  <TextArea name="ta"></TextArea>
</View>
```
### Example

You can combine the `TextArea` tag with other tags for OCR or other transcription tasks

```html
<View>
  <Image name="image" value="$ocr"/>
  <Labels name="label" toName="image">
    <Label value="Product" background="#166a45"/>
    <Label value="Price" background="#2a1fc7"/>
  </Labels>
  <Rectangle name="bbox" toName="image" strokeWidth="3"/>
  <TextArea name="transcription" toName="image" editable="true" perRegion="true" required="true" maxSubmissions="1" rows="5" placeholder="Recognized Text" displayMode="region-list"/>
</View>
```
### Example

You can keep submissions unique.

```html
<View>
  <Audio name="audio" value="$audio"/>
  <TextArea name="genre" toName="audio" skipDuplicates="true" />
</View>
```
