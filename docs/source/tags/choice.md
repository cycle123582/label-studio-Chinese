---
title: Choice
type: tags
order: 403
meta_title: Choice Tag for Single Choice Labels
meta_description: Customize Label Studio with choice tags for simple classification tasks in machine learning and data science projects.
---

The `Choice` tag represents a single choice for annotations. Use with the `Choices` tag or `Taxonomy` tag to provide specific choice options.

{% insertmd includes/tags/choice.md %}

### Example

Basic text classification labeling configuration

```html
<View>
  <Choices name="gender" toName="txt-1" choice="single">
    <Choice value="Man" />
    <Choice value="Woman" />
    <Choice value="Nonbinary" />
    <Choice value="Other" />
  </Choices>
  <Text name="txt-1" value="John went to see Mary" />
</View>
```
