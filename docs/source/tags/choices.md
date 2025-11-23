---
title: Choices
type: tags
order: 404
meta_title: Choices Tag for Multiple Choice Labels
meta_description: Customize Label Studio with multiple choice labels for machine learning and data science projects.
---

The `Choices` tag is used to create a group of choices, with radio buttons or checkboxes. It can be used for single or multi-class classification. Also, it is used for advanced classification tasks where annotators can choose one or multiple answers.

Choices can have dynamic value to load labels from task. This task data should contain a list of options to create underlying `<Choice>`s. All the parameters from options will be transferred to corresponding tags.

The `Choices` tag can be used with any data types.

{% insertmd includes/tags/choices.md %}

### Example

Basic text classification labeling configuration

```html
<View>
  <Choices name="gender" toName="txt-1" choice="single-radio">
    <Choice alias="M" value="Male" />
    <Choice alias="F" value="Female" />
    <Choice alias="NB" value="Nonbinary" />
    <Choice alias="X" value="Other" />
  </Choices>
  <Text name="txt-1" value="John went to see Mary" />
</View>
```
**Example** *(This config with dynamic labels)*  

`Choice`s can be loaded dynamically from task data. It should be an array of objects with attributes.
  `html` can be used to show enriched content, it has higher priority than `value`, however `value` will be used in the exported result.

```html
<View>
  <Audio name="audio" value="$audio" />
  <Choices name="transcription" toName="audio" value="$variants" />
</View>
<!-- {
  "data": {
    "variants": [
      { "value": "Do or doughnut. There is no try.", "html": "<img src='https://labelstud.io/images/logo.png'>" },
      { "value": "Do or do not. There is no trial.", "html": "<h1>You can use hypertext here</h2>" },
      { "value": "Do or do not. There is no try." },
      { "value": "Duo do not. There is no try." }
    ]
  }
} -->
```
**Example** *(is equivalent to this config)*  
```html
<View>
  <Audio name="audio" value="$audio" />
  <Choices name="transcription" toName="audio" value="$variants">
    <Choice value="Do or doughnut. There is no try." />
    <Choice value="Do or do not. There is no trial." />
    <Choice value="Do or do not. There is no try." />
    <Choice value="Duo do not. There is no try." />
  </Choices>
</View>
```
