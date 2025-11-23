---
title: Dynamic Image Swap
type: plugins
category: Visualization
cat: visualization
order: 220
meta_title: Dynamic Image Swap
meta_description: Changes active image based on conditions
tier: enterprise
---

<img src="/images/plugins/dynamic-images-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     For information about modifying this plugin or creating your own custom plugins, see [Customize and Build Your Own Plugins](custom).

     For general plugin information, see [Plugins for projects](/guide/plugins) and [Plugin FAQ](faq).

## About

This plugin dynamically adds an image element to the bottom of the annotation interface and updates that image based on which class label is clicked:

![Gif of image swap](/images/plugins/dynamic-images.gif)

It works as follows:

1. The plugin script defines an object called `images` that maps label names (like "Addressee" or "Signature") to specific image file URLs based on a root path.
2. It tries to get an existing image element from the global window using a unique ID (`img_uniq`). 
   - If the image isn’t already present, it creates a new `<img>` element with that ID. 
   - It then finds the main annotation container (using the selector `.lsf-main-view__annotation`) and appends the new image element to the end of it.
3. The script retrieves the list of label objects currently configured using `LSI.annotation.names.get("label").children`. 
   Then, it finds all clickable label elements (with the CSS class `.lsf-label_clickable`) and attaches a click event listener to each one.
4. When any label is clicked, the corresponding event listener uses the label’s value (determined by its index in the labels array) to look up the appropriate image URL from the `images` mapping. It then sets the `src` attribute of the image element to that URL. If no matching image exists, the `src` might be empty.


## Plugin

This plugin will work as-is with the demo check images. For your own purposes, you will want host images that Label Studio can access. 

```javascript
/**
 * Display different example check images at the bottom of the layout
 * depending on the class label selected
 */

const IMG_ID = "img_uniq";
// Use your own keys and values here for label lookup and data objects to display
const imagesRoot = "/static/plugins/src/different-images-per-label/img";
const images = {
	Addressee: `${imagesRoot}/demo-addressee.jpg`,
	"Account number": `${imagesRoot}/demo-routing-number.png`,
	"Routing number": `${imagesRoot}/demo-routing-number.png`,
	Signature: `${imagesRoot}/demo-sign.jpg`,
	Amount: `${imagesRoot}/demo-amount.jpg`,
	Watermark: `${imagesRoot}/demo-watermark.png`,
	Date: `${imagesRoot}/demo-date.png`,
	Correction: `${imagesRoot}/demo-correction.jpg`,
};

function appendCheckImg() {
	let imageEl = window[IMG_ID];
	if (!imageEl) {
		imageEl = document.createElement("img");
		imageEl.id = IMG_ID;

		const labelingInterface = document.querySelector(
			".lsf-main-view__annotation",
		);
		if (labelingInterface) {
			labelingInterface.insertAdjacentElement("beforeend", imageEl);
		} else {
			console.error("Labeling interface element not found.");
		}
	}

	// `label` is an actual tag name from config
	const labels = LSI.annotation.names.get("label").children;

	// If you will have more Labels in a future adjust the logic
	document.querySelectorAll(".lsf-label_clickable").forEach((lbl, index) =>
		lbl.addEventListener("click", () => {
			const src = images[labels[index].value];

			// if there are no images with this key image will just have an empty src
			imageEl.src = src;
		}),
	);
}

appendCheckImg();
```

## Labeling config

```xml
<View>
  <View>
    <Image name="image" value="$image" maxHeight="300px" />
    <Labels name="label" toName="image">
        <Label value="Addressee" background="gray" maxUsages="1" />
        <Label value="Account number" background="magenta" maxUsages="1" />
        <Label value="Routing number" background="green" maxUsages="1" />
        <Label value="Signature" background="red" maxUsages="1" />
        <Label value="Amount" background="orange" maxUsages="2" />
        <Label value="Watermark" background="purple" />
        <Label value="Date" background="brown" maxUsages="1" />
        <Label value="Correction" background="black" maxUsages="1" />
    </Labels>
    <Rectangle name="bbox" toName="image" strokeWidth="3" />
  </View>
  <View>
    <Header value="Example" />
    <Header value="(Please make a selection)" size="5" />
  </View>
</View>
```

**Related tags:**

* [View](/tags/view.html)
* [Image](/tags/image.html)
* [Labels](/tags/labels.html)
* [Label](/tags/label.html)
* [Rectangle](/tags/rectangle.html)
* [Header](/tags/header.html)

## Sample data

```json
{
	"data": {
		"image": "/static/plugins/src/different-images-per-label/img/demo-sample.png"
	}
}
```
