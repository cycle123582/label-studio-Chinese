---
title: KeyPointLabels
type: tags
order: 410
meta_title: Keypoint Label Tag for Labeling Keypoints
meta_description: Customize Label Studio with the KeyPointLabels tag to label keypoints for computer vision machine learning and data science projects.
---

The `KeyPointLabels` tag creates labeled keypoints. Use to apply labels to identified key points, such as identifying facial features for a facial recognition labeling project.

Use with the following data types: image.

{% insertmd includes/tags/keypointlabels.md %}

### Example

Basic keypoint image labeling configuration for multiple regions

```html
<View>
  <KeyPointLabels name="kp-1" toName="img-1">
    <Label value="Face" />
    <Label value="Nose" />
  </KeyPointLabels>
  <Image name="img-1" value="$img" />
</View>
```
