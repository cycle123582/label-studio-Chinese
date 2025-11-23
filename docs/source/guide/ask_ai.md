---
title: AI Assistant
short: AI Assistant
tier: enterprise
type: guide
order: 0
order_enterprise: 356
meta_title: About AI Assistant 
meta_description: Information about using the AI features in Label Studio
section: "Manage Your Organization"
date: 2025-01-28 16:40:16
---

The Label Studio AI Assistant is an OpenAI LLM that has been trained on the Label Studio documentation, codebase, and several other Label Studio resources.

## Use AI Assistant for project setup 

Instead of manually building labeling interfaces or project instructions from scratch, you can prompt the AI with a description of what your labeling project needs and what you want annotators to be able to select. 

You can interact with this as you would a chat, meaning that you can build off your previous instructions and request changes. 

![Screenshot of AI Assistant for labeling configs](/images/admin/ai-project.png)


## Use AI Assistant for general help

You can also use AI Assistant to ask for troubleshooting and general help with Label Studio.  

![Screenshot of AI Assistant for labeling configs](/images/admin/ai-ask.png)  


## AI Assistant FAQ

### How do I enable or disable AI Assistant?

Your organization can enable AI Assistant from the **Organization > Usage & License** page. 

!!! note
    Only users in the Owner role can modify these settings. For Starter Cloud users, [open a support ticket](mailto:support@humansignal.com) to request disablement. 

![Screenshot of settings](/images/admin/ai-settings.png) 

* **Enable AI Features**--Enable AI Assistant for your labeling interface configuration. 
* **Enable Ask AI**--Enable the AI Assistant for general Label Studio help. 

### What models do you use?

We use OpenAI Tier 5 models, primarily gpt-4o and o3-mini. 

### Do all your AI features use the same backend?

Yes. 

### What data is used to generate answers?

Only the data you provide in the chat window is used to generate responses, this includes:

* All chat messages
* Task samples you have uploaded
* The current labeling config

### How is my data used to train models?

The model is trained on public resources like our documentation, codebase, blog, and website. We also train it on additional examples we've written specifically for the model. 

We are on a Tier 5 OpenAI account, and opt out of all requests for training data.

We track requests to our AI to use as quality control, but they are only used to test the outputs of the model.  For example: If Company X asks "Make a project to label opossums," we may notice that our AI did not provide a satisfactory answer and we may create configurations with opossums in them and train the model on them. The model would not be trained on any of Company X's questions or data.

All tracked data is covered by our industry-leading [security and privacy policies](https://humansignal.com/security/).

### Is it HIPAA compliant?

Your Business Associate Agreement (BAA) does not cover these features. If you are required to comply with HIPAA, we recommend that you disable Ask AI.