---
title: Dynamic Text Spans
short: Dynamic Text Spans
type: plugins
category: Automation
cat: automation
order: 45
meta_title: Dynamic Text Spans
meta_description: Annotate edited text
tier: enterprise
---

<img src="/images/plugins/dynamic-text-spans.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     For information about modifying this plugin or creating your own custom plugins, see [Customize and Build Your Own Plugins](custom).

     For general plugin information, see [Plugins for projects](/guide/plugins) and [Plugin FAQ](faq).

## About

This plugin “binds” a `TextArea` to a `Text` field, keeping them in sync as you edit. You can then apply labels to the text in the `Text` field, allowing you annotate text that is unique from the text you imported. 

<video style="max-width: 800px;" class="gif-border" autoplay loop muted>
  <source src="/images/plugins/dynamic-text-spans.mp4">
</video>

How this plugin works:

1. It defines two tag names: 

    - `TextArea` is `transcription` 
    - `Text` is `extraction_text`
2. It captures the current annotation ID so that it can stop running when you switch regions. 
3. In `init()`, it polls every 300 ms until it finds the <TextArea> whose name starts with "transcription" (Label Studio appends random suffixes). 
4. Once found, it marks it `_already_loaded` and starts `tick()`, which runs every 300 ms: 
   - If the DOM node got replaced (e.g. you re-loaded or changed annotation), it re-queries for it. 
   - If you’ve moved to a different annotation ID, it stops. 
   - It grabs the live DOM value (`$ta.value`) or falls back to the annotation’s last saved result. 
   - It compares that string to the current `_value` of your `extraction_text` control. 
   - If they differ, it calls `text.setRemoteValue(val)`. This uses the Label Studio frontend API to update the other field’s value. 


The net effect is a real-time mirror: whatever you type or paste into the "transcription" `TextArea` automatically appears in the "extraction_text" `Text` field. And, importantly, the text you annotate in the `Text` field can be exported with your results. 

## Plugin 

```javascript
const TEXTAREA_NAME = "transcription";
const TEXT_NAME = "extraction_text";

const current_annotation = LSI.annotation.id;
(function init() {
  // textarea results have names like "tag_name:h4$h", so we use ^=
  let $ta = document.querySelector(`textarea[name^="${TEXTAREA_NAME}"]`);
  if (!$ta) return setTimeout(init, 300);
  if ($ta._already_loaded) return;

  $ta._already_loaded = true;
  (function tick() {
    // it can be another textarea with submitted result
    if (!$ta?.isConnected) {
      $ta = document.querySelector(`textarea[name^="${TEXTAREA_NAME}"]`);
    }
    // if we lost textarea/moved out of current annotation — break the cycle
    if (!$ta?.isConnected || LSI.annotation?.id !== current_annotation) return;
    setTimeout(tick, 300);

    const textarea = LSI.annotation.names.get(TEXTAREA_NAME);
    const text = LSI.annotation.names.get(TEXT_NAME);

    const val = String($ta.value ?? textarea.result?.value.text ?? "");
    if (text._value !== val) {
      text.setRemoteValue(val);
    }
  })();
})();
```

**Related LSI instance methods:**

* [LSI.annotation](custom#LSI-annotation)

## Labeling interface

```xml
<View>
  <Header value="1. Transcribe the audio below:"/>
  <Audio name="audio" value="$audio" zoom="true" hotkey="ctrl+enter"/>

  <TextArea
    name="transcription"
    toName="audio"
    rows="4"
    editable="true"
    maxSubmissions="1"
    showSubmitButton="false"
    value="$text"
  />

  <Header value="2. Extract spans from the transcript:"/>
  <!-- force HyperText into the DOM via non-breaking space -->
  <View idAttr="extractionBlock">
    <Text
      name="extraction_text"
      idAttr="extractionText"
      value="$transcription"
      inline="false"
    />
  </View>

  <Labels
    name="span_labels"
    toName="extraction_text"
    choice="multiple"
    showInline="true"
  >
    <Label value="EntityType1" background="#8cc6ff"/>
    <Label value="EntityType2" background="#ffa39e"/>
  </Labels>
</View>
```

**Related tags:**

* [View](/tags/view.html)
* [Header](/tags/header.html)
* [TextArea](/tags/textarea.html)
* [Audio](/tags/audio.html)
* [Text](/tags/text.html)
* [Labels](/tags/labels.html)

## Sample data

```json
{
  "data": {
    "audio": "https://data.heartex.net/librispeech/dev-clean/3536/8226/3536-8226-0024.flac.wav",
    "transcription": "",
    "text": "this is a test"
  }
}
```