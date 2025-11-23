---
title: Text Area Word Count
type: plugins
category: Validation
cat: validation
order: 130
meta_title: Text Area Word Count
meta_description: Validates the length of a text area based on its word count
tier: enterprise
---

<img src="/images/plugins/wordcount-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     For information about modifying this plugin or creating your own custom plugins, see [Customize and Build Your Own Plugins](custom).

     For general plugin information, see [Plugins for projects](/guide/plugins) and [Plugin FAQ](faq).

## About

This plugin validates whether users have exceeded a word count restriction. 

![Screenshot of warning](/images/plugins/wordcount.png)

## Plugin

As scripted, this plugin sets a restriction of 10 words. You can modify the word count as necessary. 

```javascript
/**
 * Validates the word count of the entered text to prevent submission if it exceeds a specified threshold
 */

let dismissed = false;

LSI.on("beforeSaveAnnotation", (store, annotation) => {
	const textAreaResult = annotation.results.find(
		(r) => r.type === "textarea" && r.from_name.name === "textarea",
	);

	if (textAreaResult) {
		words = textAreaResult.value.text[0];
		word_count = words.split(" ").length;

		if (word_count > 10) {
			Htx.showModal(
				`Word count is ${word_count}. Please reduce to 10 or less.`,
			);
			dismissed = true;
			return false; // Block submission
		}
	}

	return true; // Allow submission
});
```

**Related LSI instance methods:**

* [on(eventName, handler)](custom#LSI-on-eventName-handler)
  
**Related frontend events:**

* [beforeSaveAnnotation](/guide/frontend_reference#beforeSaveAnnotation)

## Labeling config

```xml
<View>
  <Header value="Classify the text in less than 10 words"/>
  <Text name="text" value="$text"/>
  <TextArea name="textarea" toName="text" />
</View>
```

**Related tags:**

* [View](/tags/view.html)
* [Header](/tags/header.html)
* [Text](/tags/text.html)
* [TextArea](/tags/textarea.html)

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
