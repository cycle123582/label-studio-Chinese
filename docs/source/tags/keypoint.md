---
title: KeyPoint
type: tags
order: 409
meta_title: Keypoint Tag for Adding Keypoints to Images
meta_description: Customize Label Studio with the KeyPoint tag to add key points to images for computer vision machine learning and data science projects.
---

The `KeyPoint` tag is used to add a key point to an image without selecting a label. This can be useful when you have only one label to assign to the key point.

Use with the following data types: image.

{% insertmd includes/tags/keypoint.md %}

### Example

Basic keypoint image labeling configuration

```html
<View>
  <KeyPoint name="kp-1" toName="img-1" />
  <Image name="img-1" value="$img" />
</View>
```
