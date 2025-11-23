---
title: Bulk Labeling for Text Spans with Keyboard Shortcut
short: Bulk Labeling for Text Spans
type: plugins
category: Automation
cat: automation
order: 10
meta_title: Bulk Labeling for Text Spans
meta_description: Assigns labels to all occurrences of the selected text at once
tier: enterprise
---

<img src="/images/plugins/bulk-labeling-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     For information about modifying this plugin or creating your own custom plugins, see [Customize and Build Your Own Plugins](custom).

     For general plugin information, see [Plugins for projects](/guide/plugins) and [Plugin FAQ](faq).

## About

This plugin automatically applies the same label to all matching text spans when you press the **Shift** key. 

For example, if you apply the `PER` label to the text span `Smith`, this plugin will automatically find all instances of `Smith` in the text and apply the `PER` label to them. 

![Screenshot of bulk text labeling](/images/plugins/bulk_actions.gif)

1. **Shift key tracking**
    - The plugin tracks the state of the Shift key using `keydown` and `keyup` event listeners. A boolean variable `isShiftKeyPressed` is set to `true` when the Shift key is pressed and `false` when it is released.
2. **Bulk deletion**
    - When a region (annotation) is deleted and the Shift key is pressed, the plugin identifies all regions with the same text and label as the deleted region.
    - It then deletes all these matching regions to facilitate bulk deletion.
3. **Bulk creation**
    - When a region is created and the Shift key is pressed, the plugin searches for all occurrences of the created region's text within the document.
    - It creates new regions for each occurrence of the text, ensuring that no duplicate regions are created (i.e., regions with overlapping start and end offsets are avoided).
    - The plugin also prevents tagging of single characters to avoid unnecessary annotations.
4. **Timeout**
    - To prevent rapid consecutive bulk operations, the plugin sets a timeout of 1 second. This ensures that bulk operations are not triggered too frequently.

## Plugin

```javascript
/**
 * Automatically creates text regions for all instances of the selected text and deletes existing regions
 * when the shift key is pressed.
 */

// Track the state of the shift key
let isShiftKeyPressed = false;

window.addEventListener("keydown", (e) => {
	if (e.key === "Shift") {
		isShiftKeyPressed = true;
	}
});

window.addEventListener("keyup", (e) => {
	if (e.key === "Shift") {
		isShiftKeyPressed = false;
	}
});

LSI.on("entityDelete", (region) => {
	if (!isShiftKeyPressed) return; // Only proceed if the shift key is pressed

	if (window.BULK_REGIONS) return;
	window.BULK_REGIONS = true;
	setTimeout(() => {
		window.BULK_REGIONS = false;
	}, 1000);

	const existingEntities = Htx.annotationStore.selected.regions;
	const regionsToDelete = existingEntities.filter((entity) => {
		const deletedText = region.text.toLowerCase().replace("\\\\n", " ");
		const otherText = entity.text.toLowerCase().replace("\\\\n", " ");
		return deletedText === otherText && region.labels[0] === entity.labels[0];
	});

	for (const region of regionsToDelete) {
		Htx.annotationStore.selected.deleteRegion(region);
	}

	Htx.annotationStore.selected.updateObjects();
});

LSI.on("entityCreate", (region) => {
	if (!isShiftKeyPressed) return;

	if (window.BULK_REGIONS) return;
	window.BULK_REGIONS = true;
	setTimeout(() => {
		window.BULK_REGIONS = false;
	}, 1000);

	const existingEntities = Htx.annotationStore.selected.regions;

	setTimeout(() => {
		// Prevent tagging a single character
		if (region.text.length < 2) return;
		regexp = new RegExp(
			region.text.replace("\\\\n", "\\\\s+").replace(" ", "\\\\s+"),
			"gi",
		);
		const matches = Array.from(region.object._value.matchAll(regexp));
		for (const match of matches) {
			if (match.index === region.startOffset) continue;

			const startOffset = match.index;
			const endOffset = match.index + region.text.length;

			// Check for existing entities with overlapping start and end offset
			let isDuplicate = false;
			for (const entity of existingEntities) {
				if (
					startOffset <= entity.globalOffsets.end &&
					entity.globalOffsets.start <= endOffset
				) {
					isDuplicate = true;
					break;
				}
			}

			if (!isDuplicate) {
				Htx.annotationStore.selected.createResult(
					{
						text: region.text,
						start: "/span[1]/text()[1]",
						startOffset: startOffset,
						end: "/span[1]/text()[1]",
						endOffset: endOffset,
					},
					{
						labels: [...region.labeling.value.labels],
					},
					region.labeling.from_name,
					region.object,
				);
			}
		}

		Htx.annotationStore.selected.updateObjects();
	}, 100);
});
```

**Related LSI instance methods:**

* [on(eventName, handler)](custom#LSI-on-eventName-handler)

**Related frontend APIs:**

* [regions](custom#regions)

**Related frontend events:**

* [entityCreate](/guide/frontend_reference#entityCreate)
* [entityDelete](/guide/frontend_reference#entityDelete)


## Labeling config

This is a basic NER labeling config. 

```xml
<View>
  <Labels name="label" toName="text">
    <Label value="PER" background="red"/>
    <Label value="ORG" background="darkorange"/>
    <Label value="LOC" background="orange"/>
    <Label value="MISC" background="green"/>
  </Labels>

  <Text name="text" value="$text"/>
</View>
```

**Related tags:**

* [View](/tags/view.html)
* [Text](/tags/text.html)
* [Labels](/tags/labels.html)

## Sample data

```json
[
   {
      "data": {
         "text": "Opossums are nocturnal animals that are often seen scavenging for food at night. They have a prehensile tail that helps them climb trees and navigate their environment."
      }
   },
   {
      "data": {
         "text": "Opossums are known for their ability to play dead when threatened, a behavior known as 'playing possum'. This act can deter predators and give the opossum a chance to escape."
      }
   },
   {
      "data": {
         "text": "Opossums are marsupials, meaning they carry and nurse their young in a pouch. Baby opossums, called joeys, stay in the pouch for about two months after birth."
      }
   }
]
```
