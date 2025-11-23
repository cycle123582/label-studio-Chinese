---
title: Brush
type: tags
order: 400
meta_title: Brush Tag for Image Segmentation Labeling
meta_description: Customize Label Studio with brush tags for image segmentation labeling for machine learning and data science projects.
---

The `Brush` tag is used for image segmentation tasks where you want to apply a mask or use a brush to draw a region on the image.

Use with the following data types: image.

{% insertmd includes/tags/brush.md %}

### Example

Basic image segmentation labeling configuration:

```xml
<View>
  <Brush name="brush" toName="image" />
  <Labels name="labels" toName="image">
    <Label value="Person" />
    <Label value="Animal" />
  </Labels>
  <Image name="image" value="$image" />
</View>
```
