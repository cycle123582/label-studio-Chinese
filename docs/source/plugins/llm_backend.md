---
title: Connect to LLM Backend
type: plugins
category: Automation
cat: automation
order: 40
meta_title: Connect to LLM Backend
meta_description: Sends prompts to an LLM URL
---

<img src="/images/plugins/llm-backend-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     For information about modifying this plugin or creating your own custom plugins, see [Customize and Build Your Own Plugins](custom).

     For general plugin information, see [Plugins for projects](/guide/plugins) and [Plugin FAQ](faq).

## About

This plugin connects to an open LLM endpoint, allowing you to generate responses as part of the annotation workflow. 

![Screenshot of LLM analyzing](/images/plugins/llm-backend.gif)

## Plugin

Before using this, replace the `MY_URL_ROOT` value with a URL that does not require authentication. This would typically be an internal service or an LLM behind a proxy. 

```javascript 
window.LSI = LSI;

const baseUrl = "MY_URL_ROOT";

/**
 * Makes a request to the configured LLM sending the given prompt
 */
async function fetchLLM(prompt) {
	const params = {
		prompt,
		llm_endpoint_name: "chatgpt",
		redteam_categories: ["cat1"],
	};

	const searchParams = new URLSearchParams(params).toString();
	const url = `${baseUrl}?${searchParams}`;

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			// No auth needed because the API is open
		},
	});

	const data = await response.json();
}

/**
 * Sends the introduced prompt to the LLM endpoint and attaches the given results to the annotation
 */
async function sendPrompt() {
	const promptTag = LSI.annotation.names.get("prompt");
	promptTag.submitChanges();
	const prompt = promptTag.result?.value.text.join("\n");

	if (!prompt) {
		Htx.showModal("The prompt is empty", "error");
		return false;
	}

	let response;

	// console.log("Input prompt:" + prompt);
	try {
		response = await fetchLLM(prompt);
	} catch (error) {
		Htx.showModal(
			`Error fetching the LLM endpoint "${baseUrl}": ${error.message}`,
			"error",
		);
		return false;
	}
	const results = [];

	const llmResponse = response.LLM_response;
	if (llmResponse) {
		const llmResult = {
			from_name: "response",
			to_name: "placeholder",
			type: "textarea",
			value: { text: [] },
		};
		results.push(llmResult);
	}
	// console.log("Response:" + llmResponse["LLM_response"]);

	const category = response.Category?.category;
	if (category?.length) {
		const attackResult = {
			from_name: "category",
			to_name: "placeholder",
			type: "choices",
			value: { choices: category },
		};
		results.push(attackResult);
		// console.log("Category:" + category);
	}

	const reasonText = response.Type?.reason;
	if (reasonText) {
		const reasonResult = {
			from_name: "reason",
			to_name: "placeholder",
			type: "textarea",
			value: { text: [reasonText] },
		};
		results.push(reasonResult);
		// console.log("Reason:" + reason);
	}

	LSI.annotation.deserializeResults(results);
}

/**
 * Sets up the onClick event of the template to trigger the LLM request
 */
function setup() {
	const aBtn = document.querySelector(".analyzeButton");
	const button = document.createElement("button");
	button.textContent = "Analyze"; // Set the button text

	// Attach an onclick event to the button
	button.onclick = sendPrompt;

	// Insert the button into the div
	aBtn.replaceChildren(button);
}

setup();

```

**Related LSI instance methods:**

* [.annotation)](custom#LSI-annotation)


## Labeling config

!!! info Tip
    You can add `value="$text"` to the TextArea parameters of the prompt to pre-fill the text from your data. 

```xml
<View>
    <Style>
      .lsf-main-content.lsf-requesting .prompt::before { content: ' loading...'; color: #808080; }
      .placeholder { display: none; }
      .llm_response textarea { background-color: #f0f0f0; /* Optional: gives a "disabled" feel */ }
      .analyzeButton button {
        background: #1890ff;
        border-color: #1890ff;
        box-shadow: 0 2px 0 rgba(0, 0, 0, .045);
        color: #fff;
        text-shadow: 0 -1px 0 rgba(0, 0, 0, .12);
        padding: 4px 15px;
      }
    </Style>

    <View className="placeholder">
    	<Text name="placeholder" value="placeholder" />
  	</View>

    <Header value="Enter Prompt to Analyze:"/>
    <TextArea
      name="prompt"
      toName="placeholder"
      transcription="true"
      showSubmitButton="false"
      editable="true"
      rows="4"
      maxSubmissions="1"
      placeholder="Type the prompt here..."
    />
    <View className="analyzeButton"></View>

    <Header value="LLM Response:"/>
    <View className="llm_response">
      <TextArea
        name="response"
        toName="placeholder"
        transcription="true"
        rows="6"
        showSubmitButton="false"
        editable="false"
        smart="false"
        maxSubmissions="1"
        placeholder="The LLM response will appear here..."
      />
    </View>

    <Header value="Category:"/>
    <Choices name="category" toName="placeholder" choice="single" showInLine="true">
      <Choice value="none" />
      <Choice value="cat1" />
      <Choice value="cat2" />
      <Choice value="cat3" />
    </Choices>

    <Header value="Reason"/>
    <TextArea
      name="reason"
      toName="placeholder"
      rows="2"
      editable="false"
      smart="false"
      maxSubmissions="1"
      placeholder="Write something here..."
    />
</View>
```

**Related tags:**

* [View](/tags/view.html)
* [Style](/tags/style.html)
* [Text](/tags/text.html)
* [Header](/tags/header.html)
* [TextArea](/tags/textarea.html)
* [Choices](/tags/choices.html)

## Sample data

```json
[
   {
      "data": {
         "text": "What is the closest relative to an opossum?"
      }
   },
   {
      "data": {
         "text": "What is a fun opossum fact?"
      }
   },
   {
      "data": {
         "text": "Why are opossums cool?"
      }
   }
]
```