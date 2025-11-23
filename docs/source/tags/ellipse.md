---
title: Ellipse
type: tags
order: 406
meta_title: Ellipse Tag for Adding Elliptical Bounding Box to Images
meta_description: Customize Label Studio with ellipse tags to add elliptical bounding boxes to images for machine learning and data science projects.
---

The `Ellipse` tag is used to add an elliptical bounding box to an image. Use for bounding box image segmentation tasks with ellipses.

Use with the following data types: image.

{% insertmd includes/tags/ellipse.md %}

### Example

Basic image segmentation with ellipses labeling configuration

```html
<View>
  <Ellipse name="ellipse1-1" toName="img-1" />
  <Image name="img-1" value="$img" />
</View>
```
