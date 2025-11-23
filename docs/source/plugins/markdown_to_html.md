---
title: Markdown to HTML
type: plugins
category: Visualization
cat: visualization
order: 210
meta_title: Markdown to HTML
meta_description: Converts markdown to HTML format
tier: enterprise
---

<img src="/images/plugins/markdown-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     For information about modifying this plugin or creating your own custom plugins, see [Customize and Build Your Own Plugins](custom).

     For general plugin information, see [Plugins for projects](/guide/plugins) and [Plugin FAQ](faq).

## About

This plugin renders basic markdown as HTML. 

![Screenshot of markdown formatting](/images/plugins/markdown.png)


## Plugin

```javascript
/**
 * Converts the Markdown code given in a specific selector to HTML code.
 */

window.LSI = LSI;

await LSI.import("https://unpkg.com/showdown/dist/showdown.min.js");

const sumBlock = document.querySelector(".lsf-richtext");

if (sumBlock) {
	const converter = new showdown.Converter();
	const html = converter.makeHtml(LSI.task.data.chat_transcript);
	sumBlock.innerHTML = html;
}
```

**Related LSI instance methods:**

* [import(url, integrity)](custom#LSI-import-url-integrity)

## Labeling config

This labeling config displays a chat transcript on the left and choices on the right. 

```xml
<View>
  <Style>
    .container {
      display: flex;
      justify-content: space-between;
    }
    .left-column {
      width: 60%;
    }
    .right-column {
      width: 35%;
      margin-left: 20px;
    }
    .summary-box {
      padding: 10px;
      background-color: #f8f9fa;
      border: 1px solid #ddd;
      border-radius: 5px;
      margin-bottom: 10px;
    }
  </Style>

  <View className="container">
    <!-- Left Column: Chat Transcript -->
    <View className="left-column summaryBlock">
      <Header value="Chat transcript" />
      <!-- Use Text tag to display the markdown content of the conversation -->
      <Text name="chat_transcript" value="$chat_transcript" markdown="true" />
    </View>

    <!-- Right Column: Classification Options -->
    <View className="right-column">
	  <Header value="Classify chat quality" />
      <!-- Relevance of the summary -->
      <Choices name="relevance" toName="chat_transcript" required="true">
        <Choice value="Highly quality" />
        <Choice value="Bad quality" />
      </Choices>
    </View>
  </View>
</View>
```

**Related tags:**

* [View](/tags/view.html)
* [Style](/tags/style.html)
* [Text](/tags/text.html)
* [Header](/tags/header.html)
* [Choices](/tags/choices.html)

## Sample data

```json
{
	"data": {
		"chat_transcript": "**User**: The printer in the office is not working. Can you help troubleshoot?\n\n**LLM Agent**: I can help with that. Is the printer showing any error codes or messages on the display?\n\n**User**: It’s showing 'Paper Jam' but I’ve checked and there’s no paper stuck in there.\n\n**LLM Agent**: Sometimes the sensors in the printer may still think there’s a jam after clearing it. Let’s try turning the printer off for a minute and turning it back on. That should reset the sensors.\n\n**User**: Okay, let me try that... It worked! The error message is gone now.\n\n**LLM Agent**: Great! If you encounter the issue again, let me know. I can also file a maintenance ticket if the problem persists.\n\n**User**: Will do, thanks for your help!"
	}
}
```
