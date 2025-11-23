---
title: Model provider API keys for Prompts
short: API keys
tier: enterprise
type: guide
order: 0
order_enterprise: 229
meta_title: Model provider API keys
meta_description: Add API keys to use with Prompts
section: Prompts
date: 2024-06-11 16:53:16
---

There are two approaches to adding a model provider API key. 

* In one scenario, you get one provider connection per organization, and this provides access to a set of whitelisted models. Examples include:

    * OpenAI
    * Vertex AI
    * Gemini
    * Anthropic

* In the second scenario, you add a separate API key per model. Examples include:

    * Azure OpenAI
    * Azure AI Foundry
    * Custom

!!! note
        If you are restricting network access to your resource, you may need to whitelist HumanSignal IP addresses ([IP ranges on SaaS](saas#Outbound-Connections-IP-Addresses)) when configuring network security.


Once a model is added via the API key, anyone in the organization who has access to the Prompts feature can select the associated models when executing their prompt. 

You can see what API keys you have and add new ones by clicking **API Keys** in the top right of the Prompts page to open the **Model Provider API Keys** window:

![Screenshot of the API keys button](/images/prompts/model_keys.png)

{% insertmd includes/base_models.md %} 

Once you have added a key, all supported models will appear in the base model drop-down when you [draft your prompt](prompts_draft).

## Add a model provider

!!! note
    Models you configure here will also be available in your [organization-level providers](model_providers). 

{% insertmd includes/model_keys.md %}
