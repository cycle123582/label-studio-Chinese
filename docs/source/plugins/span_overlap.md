---
title: Text Span Overlap Validation
type: plugins
category: Validation
cat: validation
order: 110
meta_title: Text span overlap validation
meta_description: Prevents overlap of text spans
tier: enterprise
---

<img src="/images/plugins/ner-overlap-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     For information about modifying this plugin or creating your own custom plugins, see [Customize and Build Your Own Plugins](custom).

     For general plugin information, see [Plugins for projects](/guide/plugins) and [Plugin FAQ](faq).

## About

This plugin displays an error message if text spans overlap:

![Screenshot of warning](/images/plugins/ner-overlap.png)

It works by:

1. Retrieving all currently created regions (annotations) from the annotation store. 
2. Filtering these regions to only include those of type `richtextregion` with valid numeric start and end offsets. 
3. Sorting the filtered text regions based on their start offsets (in ascending order). 
4. Iterating over them pairwise and checking if any region’s end offset is greater than the next region’s start offset. If it does, this indicates an overlap. 
5. If any overlapping pairs are found, the script constructs an error message listing the overlapping text pairs, displays this error using a modal, and prevents the annotation from being saved. 

    This is an example of a "hard" block, meaning that the user must resolve the issue before they can proceed. 
6. If no overlaps are detected, the annotation is submitted. 

## Plugin

```javascript
/**
 * Validates there are no NER text spans overlap before submitting an annotation
 */

LSI.on("beforeSaveAnnotation", (store, annotation) => {
	const existingEntities = Htx.annotationStore.selected.regions;

	const textRegions = existingEntities.filter(
		(r) =>
			r.type === "richtextregion" &&
			typeof r.startOffset === "number" &&
			typeof r.endOffset === "number",
	);

	// console.log(textRegions);  // Print the filtered result
	textRegions.sort((a, b) => a.startOffset - b.startOffset);

	const overlaps = [];

	// Check for overlaps
	for (let i = 0; i < textRegions.length - 1; i++) {
		const current = textRegions[i];
		const next = textRegions[i + 1];
		// console.log("This is current: ", current, "This is next: ", next);

		if (current.endOffset > next.startOffset) {
			// Collect overlapping regions
			const currentText = current.text || "Unknown text";
			const nextText = next.text || "Unknown text";
			overlaps.push(`"${currentText}" and "${nextText}"`);
		}
	}

	if (overlaps.length > 0) {
		// Show error with all overlapping text pairs
		const errorMessage = `Overlapping annotations are not allowed between the following text pairs: ${overlaps.join(", ")}. Please adjust your annotations to remove overlaps.`;
		Htx.showModal(errorMessage, "error");
		return false; // Prevent saving the annotation
	}

	return true; // Allow saving the annotation
});

```

**Related LSI instance methods:**

* [on(eventName, handler)](custom#LSI-on-eventName-handler)
  
**Related frontend events:**

* [beforeSaveAnnotation](/guide/frontend_reference#beforeSaveAnnotation)

## Labeling config

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
