---
title: Taxonomy
type: tags
order: 426
meta_title: Taxonomy Tag for Hierarchical Labels
meta_description: Customize Label Studio with the Taxonomy tag and use hierarchical labels for machine learning and data science projects.
---

The `Taxonomy` tag is used to create one or more hierarchical classifications, storing both choice selections and their ancestors in the results. Use for nested classification tasks with the `Choice` tag.

You can define nested classifications using the `Choice` tag, or retrieve external classifications using the `apiUrl` parameter. For more information on these options, see the [Taxonomy template page](/templates/taxonomy).

Use with the following data types: audio, image, HTML, paragraphs, text, time series, video.

{% insertmd includes/tags/taxonomy.md %}

### Example

Labeling configuration for providing a taxonomy of choices in response to a passage of text

```html
<View>
  <Taxonomy name="media" toName="text">
    <Choice value="Online">
      <Choice value="UGC" />
      <Choice value="Free" />
      <Choice value="Paywall">
        <Choice value="NY Times" />
        <Choice value="The Wall Street Journal" />
      </Choice>
    </Choice>
    <Choice value="Offline" />
  </Taxonomy>
  <Text name="text" value="You'd never believe what he did to the country" />
</View>
```
