---
title: BitmaskLabels
type: tags
order: 402
meta_title: Bitmask Label Tag for Pixel-Wise Image Segmentation Labeling
meta_description: Customize Label Studio with bitmask pixel-wise label tags for image segmentation labeling for machine learning and data science projects.
---

The `Bitmask` tag is for pixel-wise image segmentation tasks, and is used in the area where you want to apply a mask or use a brush to draw a region on the image.

`Bitmask` operates on the pixel level and outputs a base64-encoded PNG data URL image with black pixels on transparent background.

Export data example: `data-url:image/png;[base64-encoded-string]`

<video class="Video astro-OQEP7KKB" loop="" playsinline="" autoplay="" muted="" style="width:100%;">
  <source src="https://cdn.sanity.io/files/mzff2hy8/production/4812f66851a7fd4836e729bc7ccb7e510823af5d.mp4" type="video/mp4" class="astro-OQEP7KKB">
</video>

<br/>
<br/>

!!! note 

    You need to set `smoothing="false"` on the `<Image>` tag to be able to work with individual pixels. 

Use with the following data types: image.

{% insertmd includes/tags/bitmasklabels.md %}

### Example

Basic image segmentation labeling configuration

```html
<View>
  <BitmaskLabels name="labels" toName="image">
    <Label value="Person" />
    <Label value="Animal" />
  </BitmaskLabels>
  <Image name="image" value="$image" smoothing="false" />
</View>
```
