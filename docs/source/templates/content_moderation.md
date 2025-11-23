---
title: Content Moderation
type: templates
category: Natural Language Processing
cat: natural-language-processing
order: 235
meta_title: Content Moderation Labeling Template
meta_description: Template for performing content moderation labeling tasks. 
---

<img src="/images/templates/content-moderation.png" alt="" class="gif-border" width="552px"  />

You can use this template for a content moderation project. 

This template displays text from your source data, and then allows an annotator to pick any combination of content moderation labels. If the pre-configured options are not sufficient, they can add context or comments in the provided text area. 

## Labeling configuration

```xml
<View>
  <Text name="text" value="$text"/>
  <Choices name="content_moderation" toName="text" choice="multiple" showInline="false">
    <Choice value="Toxic" background="red"/>
    <Choice value="Severely Toxic" background="brown"/>
    <Choice value="Obscene" background="green"/>
    <Choice value="Threat" background="blue"/>
    <Choice value="Insult" background="orange"/>
    <Choice value="Hate" background="grey"/>
  </Choices>
  <View style="margin: var(--spacing-tight); box-shadow: 0 4px 8px rgba(var(--color-neutral-shadow-raw) / 10%); padding: var(--spacing-tight) var(--spacing-base); border-radius: var(--corner-radius-small); background-color: var(--color-neutral-background); border: 1px solid var(--color-neutral-border);">
    <Header value="Please provide additional comments"/>
    <TextArea name="comments" toName="text" required="false"/>
  </View>
</View>
```

## About the labeling configuration

#### Text

```xml
<Text name="text" value="$text"/>
```

This displays the text that needs moderation. There are multiple ways to import text files. See the [Text tag documentation](/tags/text.html) and our [import documentation](/guide/tasks#Types-of-data-you-can-import-into-Label-Studio). 

#### Choices

```xml
<Choices name="content_moderation" toName="text" choice="multiple" showInline="false">
    <Choice value="Toxic" background="red"/>
    <Choice value="Severely Toxic" background="brown"/>
    <Choice value="Obscene" background="green"/>
    <Choice value="Threat" background="blue"/>
    <Choice value="Insult" background="orange"/>
    <Choice value="Hate" background="grey"/>
</Choices>
```

The <Choices> tag provides a set of six class labels for the text. Because `choice="multiple"`, annotators can select more than one label if they apply. The `showInline="false"` parameter puts each option on a separate line rather than side-by-side.


#### Text area

```xml
<TextArea name="comments" toName="text" required="false"/>
```

The text area block (wrapped in a styled `<View>`) prompts annotators for optional comments on why they picked certain labels or any other observations they want to add.


## Related tags

- [Text](/tags/text.html)
- [Choices](/tags/choices.html)
- [TextArea](/tags/textarea.html)