---
title: Text
type: tags
order: 309
meta_title: Text Tags for Text Objects
meta_description: Customize Label Studio with the Text tag to annotate text for NLP and NER machine learning and data science projects.
---

The `Text` tag shows text that can be labeled. Use to display any type of text on the labeling interface.
You can use `<Style>.htx-text{ white-space: pre-wrap; }</Style>` to preserve all spaces in the text, otherwise spaces are trimmed when displayed and saved in the results.
Every space in the text sample is counted when calculating result offsets, for example for NER labeling tasks.

Use with the following data types: text.

### How to read my text files in python?
The Label Studio editor counts `\r\n` as two different symbols, displaying them as `\n\n`, making it look like there is extra margin between lines.
You should either preprocess your files to replace `\r\n` with `\n` completely, or open files in Python with `newline=''` to avoid converting `\r\n` to `\n`:
`with open('my-file.txt', encoding='utf-8', newline='') as f: text = f.read()`
This is especially important when you are doing span NER labeling and need to get the correct offsets:
`text[start_offset:end_offset]`

{% insertmd includes/tags/text.md %}

### Example

Labeling configuration to label text for NER tasks with a word-level granularity

```html
<View>
  <Text name="text-1" value="$text" granularity="word" highlightColor="#ff0000" />
  <Labels name="ner" toName="text-1">
    <Label value="Person" />
    <Label value="Location" />
  </Labels>
</View>
```
### Example
```html
<Text name="p1">Some simple text with explanations</Text>
```
