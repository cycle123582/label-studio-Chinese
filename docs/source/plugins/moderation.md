---
title: Simple Content Moderation
type: plugins
category: Validation
cat: validation
order: 105
meta_title: Simple Content Moderation
meta_description: Detect prohibited words in text areas
tier: enterprise
---

<img src="/images/plugins/moderation-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     For information about modifying this plugin or creating your own custom plugins, see [Customize and Build Your Own Plugins](custom).

     For general plugin information, see [Plugins for projects](/guide/plugins) and [Plugin FAQ](faq).

## About

This plugin checks to ensure that the annotation does not include obscenity or disallowed words. 

In the example below, if a user tries to submit an annotation with the word “hate” added to any audio transcription, they see a pop-up warning. 

Note that this is a "soft" block, meaning that the user can dismiss the modal and still proceed. For an example of a "hard" block, see [Validate JSON](json_validation). 

![Screenshot of moderation modal in Label Studio](/images/plugins/moderation.png)


## Plugin

```javascript
/**
 * Simple content moderation plugin that prevents saving annotations containing hate speech
 *
 * This plugin monitors text entered into TextArea regions and checks for the word "hate"
 * before allowing the annotation to be saved. If found, it shows an error message and
 * prevents submission. This would happen only once, if user clicks Submit again it would
 * work with no errors.
 *
 * The plugin uses Label Studio's beforeSaveAnnotation event which is triggered before
 * an annotation is saved. Returning false from this event handler prevents the save
 * operation from completing.
 */

let dismissed = false;

LSI.on("beforeSaveAnnotation", (store, ann) => {
	// text in TextArea is always an array
	const obscene = ann.results.find(
		(r) =>
			r.type === "textarea" && r.value.text.some((t) => t.includes("hate")),
	);
	if (!obscene || dismissed) return true;

	// select region to see textarea
	if (!obscene.area.classification) ann.selectArea(obscene.area);

	Htx.showModal("The word 'hate' is disallowed", "error");
	dismissed = true;

	return false;
});
```

**Related LSI instance methods:**

* [on(eventName, handler)](custom#LSI-on-eventName-handler)
  
**Related frontend events:**

* [beforeSaveAnnotation](/guide/frontend_reference#beforeSaveAnnotation)

## Labeling config

```xml
<View>
  <Labels name="labels" toName="audio">
    <Label value="Speech" />
    <Label value="Noise" />
  </Labels>

  <Audio name="audio" value="$audio"/>

  <TextArea name="transcription" toName="audio"
    editable="true"
    perRegion="true"
    required="true"
  />
</View>
```

**Related tags:**

* [View](/tags/view.html)
* [Labels](/tags/labels.html)
* [Audio](/tags/audio.html)
* [TextArea](/tags/textarea.html)

## Sample data

```json
[
  {
    "audio": "https://data.heartex.net/librispeech/dev-clean/3536/8226/3536-8226-0024.flac.wav"
  }
]
```