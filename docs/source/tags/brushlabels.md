---
title: BrushLabels
type: tags
order: 401
meta_title: Brush Label Tag for Image Segmentation Labeling
meta_description: Customize Label Studio with brush label tags for image segmentation labeling for machine learning and data science projects.
---

The `BrushLabels` tag for image segmentation tasks is used in the area where you want to apply a mask or use a brush to draw a region on the image.

Use with the following data types: image.

{% insertmd includes/tags/brushlabels.md %}

### Example

Basic image segmentation labeling configuration

```html
<View>
  <BrushLabels name="labels" toName="image">
    <Label value="Person" />
    <Label value="Animal" />
  </BrushLabels>
  <Image name="image" value="$image" />
</View>
```
