---
title: EllipseLabels
type: tags
order: 407
meta_title: Ellipse Label Tag for Labeling Images with Elliptical Bounding Boxes
meta_description: Customize Label Studio with the EllipseLabels tag to label images with elliptical bounding boxes for semantic image segmentation machine learning and data science projects.
---

The `EllipseLabels` tag creates labeled ellipses. Use to apply labels to ellipses for semantic segmentation.

Use with the following data types: image.

{% insertmd includes/tags/ellipselabels.md %}

### Example

Basic semantic image segmentation labeling configuration

```html
<View>
  <EllipseLabels name="labels" toName="image">
    <Label value="Person" />
    <Label value="Animal" />
  </EllipseLabels>
  <Image name="image" value="$image" />
</View>
```
