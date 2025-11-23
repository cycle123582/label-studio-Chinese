---
title: Header
type: tags
order: 503
meta_title: Header Tag to Show Headers
meta_description: Customize Label Studio with the Header tag to display a header for a labeling task for machine learning and data science projects.
---

The `Header` tag is used to show a header on the labeling interface.

{% insertmd includes/tags/header.md %}

### Example

Display a header on the labeling interface based on a field in the data

```html
<View>
  <Header value="$text" />
</View>
```
### Example

Display a static header on the labeling interface

```html
<View>
  <Header value="Please select the class" />
</View>
```
