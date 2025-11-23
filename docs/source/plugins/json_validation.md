---
title: Validate JSON
type: plugins
category: Validation
cat: validation
order: 100
meta_title: Validate JSON
meta_description: Checks that the introduced text is a valid JSON
tier: enterprise
---

<img src="/images/plugins/json-validate-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     For information about modifying this plugin or creating your own custom plugins, see [Customize and Build Your Own Plugins](custom).

     For general plugin information, see [Plugins for projects](/guide/plugins) and [Plugin FAQ](faq).

## About
This plugin parses the contexts of a `TextArea` field to check for valid JSON. If the JSON is invalid, it shows an error and prevents the annotation from being saved.

This is an example of a "hard" block, meaning that the user must resolve the issue before they can proceed. 

![Screenshot of JSON error message](/images/plugins/json-validate.png)

## Plugin

```javascript
 LSI.on("beforeSaveAnnotation", (store, annotation) => {
  const textAreaResult = annotation.results.find(r => r.type === 'textarea' && r.from_name.name === 'answer');
  if (textAreaResult) {
    try {
      JSON.parse(textAreaResult.value.text[0]);
    } catch (e) {
      Htx.showModal("Invalid JSON format. Please correct the JSON and try again.", "error");
      return false;
    }
  }
  return true;
});
```

**Related LSI instance methods:**

* [on(eventName, handler)](custom#LSI-on-eventName-handler)

**Related frontend events:**

* [beforeSaveAnnotation](/guide/frontend_reference#beforeSaveAnnotation)


## Labeling config

```xml
<View>
  <View>
    <Filter toName="label_rectangles" minlength="0" name="filter"/>
    <RectangleLabels name="label_rectangles" toName="image" canRotate="false" smart="true">
      <Label value="table" background="Blue"/>
      <Label value="cell" background="Red"/>
      <Label value="column" background="Green"/>
      <Label value="row" background="Purple"/>
    </RectangleLabels>
  </View>
  <View>
    <Image name="image" value="$image" />
  </View>
  <View style=".htx-text { white-space: pre-wrap; }">
    <TextArea name="answer" toName="image"
              editable="true"
              perRegion="true"
              required="false"
              maxSubmissions="1"
              rows="10"
              placeholder="Parsed Row JSON"
              displayMode="tag"/>
  </View>
</View>
```

**Related tags:**

* [View](/tags/view.html)
* [RectangleLabels](/tags/rectanglelabels.html)
* [TextArea](/tags/textarea.html)
* [Labels](/tags/labels.html)

## Sample data

```json
[
  {
    "image": "https://labelstud.io/demo/Datasets/Image/Object Detection/Image_66.jpg"
  }
]
```
