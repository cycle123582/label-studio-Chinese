---
title: PolygonLabels
type: tags
order: 418
meta_title: Polygon Label Tag for Labeling Polygons in Images
meta_description: Customize Label Studio with the PolygonLabels tag and label polygons in images for semantic segmentation machine learning and data science projects.
---

The `PolygonLabels` tag is used to create labeled polygons. Use to apply labels to polygons in semantic segmentation tasks.

Use with the following data types: image.

{% insertmd includes/tags/polygonlabels.md %}

### Example

Basic labeling configuration for polygonal semantic segmentation of images

```html
<View>
  <Image name="image" value="$image" />
  <PolygonLabels name="labels" toName="image">
    <Label value="Car" />
    <Label value="Sign" />
  </PolygonLabels>
</View>
```
