---
title: Rectangle
type: tags
order: 421
meta_title: Rectangle Tag for Adding Rectangle Bounding Box to Images
meta_description: Customize Label Studio with the Rectangle tag to add rectangle bounding boxes to images for machine learning and data science projects.
---

The `Rectangle` tag is used to add a rectangle (Bounding Box) to an image without selecting a label. This can be useful when you have only one label to assign to a rectangle.

Use with the following data types: image. Annotation results store the left top corner of the bounding box,
read more about it and rotation in the [Object Detection Template](/templates/image_bbox.html#Bounding-box-rotation-in-the-Label-Studio-results).

{% insertmd includes/tags/rectangle.md %}

### Example

Basic labeling configuration for adding rectangular bounding box regions to an image

```html
<View>
  <Rectangle name="rect-1" toName="img-1" />
  <Image name="img-1" value="$img" />
</View>
```
