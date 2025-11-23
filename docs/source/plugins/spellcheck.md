---
title: Spellcheck
type: plugins
category: Validation
cat: validation
order: 120
meta_title: Spellcheck
meta_description: Detect misspelled words in the template text areas
tier: enterprise
---

<img src="/images/plugins/spellcheck-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     For information about modifying this plugin or creating your own custom plugins, see [Customize and Build Your Own Plugins](custom).

     For general plugin information, see [Plugins for projects](/guide/plugins) and [Plugin FAQ](faq).

## About

This script checks for spelling errors in content that is within text areas. If a user tries to submit their work while there is a spelling error in the text area, they receive an error message:

![Screenshot of warning](/images/plugins/spellcheck.png)

## Plugin

```javascript
// Load the spelling check library
await LSI.import('https://cdn.jsdelivr.net/npm/typo-js@1.1.0/typo.js')

// Initialize the dictionary
const dictionary = new Typo('en_US', false, false, { dictionaryPath: 'https://cdn.jsdelivr.net/npm/typo-js@1.1.0/dictionaries' })
const WORD_REGEX = /\w+/g

LSI.on('beforeSaveAnnotation', async (store, annotation) => {
  // Find all textareas with misspellings
  let misspelledAreas = annotation.results.filter(
    r => r.type === 'textarea' && r.value.text.some(t => {
      let words = t.match(WORD_REGEX) || [] // Extract words
      return words.some(word => !dictionary.check(word))
    })
  )

  // If no misspelled textareas, continue with the save process
  if (misspelledAreas.length === 0) return true

  // Collect all misspelled words
  let misspelledWords = [...new Set(misspelledAreas.flatMap(area =>
    area.value.text.flatMap(t =>
      (t.match(WORD_REGEX) || []).filter(word => !dictionary.check(word))
    )
  ))]
  // console.log('words:', misspelledWords) // print misspelled words

  // Select the first region to see textarea
  if (!misspelledAreas[0].area.classification) annotation.selectArea(misspelledAreas[0].area)

  // Show the modal with the misspelled words
  Htx.showModal(`Misspelled words: ${misspelledWords.join(', ')}. Please correct them before submitting.`, 'error')

  // Block the saving process
  return false
})
```

**Related LSI instance methods:**

* [import(url, integrity)](custom#LSI-import-url-integrity)
* [on(eventName, handler)](custom#LSI-on-eventName-handler)
  
**Related frontend events:**

* [beforeSaveAnnotation](/guide/frontend_reference#beforeSaveAnnotation)

## Labeling interface

```xml
<View>
  <Image name="image" value="$image"/>
  <Header value="Describe the image:"/>
  <TextArea name="caption" 
            toName="image" 
            placeholder="Enter description here..."
            rows="5" 
            maxSubmissions="1"/>
</View>
```

**Related tags:**

* [View](/tags/view.html)
* [Header](/tags/header.html)
* [Image](/tags/image.html)
* [TextArea](/tags/textarea.html)


## Sample data

```json
[
  {
    "image": "https://labelstud.io/demo/Datasets/Image/Object Detection/Image_66.jpg"
  }
]
```
