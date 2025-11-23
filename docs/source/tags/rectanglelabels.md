---
title: RectangleLabels
type: tags
order: 422
meta_title: Rectangle Label Tag to Label Rectangle Bounding Box in Images
meta_description: Customize Label Studio with the RectangleLabels tag and add labeled rectangle bounding boxes in images for semantic segmentation and object detection machine learning and data science projects.
---

The `RectangleLabels` tag creates labeled rectangles. Use to apply labels to bounding box semantic segmentation tasks.

Use with the following data types: image. Annotation results store the left top corner of the bounding box,
read more about it and rotation in the [Object Detection Template](/templates/image_bbox.html#Bounding-box-rotation-in-the-Label-Studio-results).

{% insertmd includes/tags/rectanglelabels.md %}

### Example

Basic labeling configuration for applying labels to rectangular bounding boxes on an image

```html
<View>
  <RectangleLabels name="labels" toName="image">
    <Label value="Person" />
    <Label value="Animal" />
  </RectangleLabels>
  <Image name="image" value="$image" />
</View>
```
