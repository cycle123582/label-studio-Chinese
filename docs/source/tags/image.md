---
title: Image
type: tags
order: 304
meta_title: Image Tags for Images
meta_description: Customize Label Studio with the Image tag to annotate images for computer vision machine learning and data science projects.
---

The `Image` tag shows an image on the page. Use for all image annotation tasks to display an image on the labeling interface.

Use with the following data types: images.

When you annotate image regions with this tag, the annotations are saved as percentages of the original size of the image, from 0-100.

{% insertmd includes/tags/image.md %}

### Example

Labeling configuration to display an image on the labeling interface

```html
<View>
  <!-- Retrieve the image url from the url field in JSON or column in CSV -->
  <Image name="image" value="$url" rotateControl="true" zoomControl="true"></Image>
</View>
```
### Example

Labeling configuration to perform multi-image segmentation

```html
<View>
  <!-- Retrieve the image url from the url field in JSON or column in CSV -->
  <Image name="image" valueList="$images" rotateControl="true" zoomControl="true"></Image>
</View>
<!-- {
  "data": {
    "images": [
      "https://images.unsplash.com/photo-1556740734-7f3a7d7f0f9c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
      "https://images.unsplash.com/photo-1556740734-7f3a7d7f0f9c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
    ]
  }
} -->
```
