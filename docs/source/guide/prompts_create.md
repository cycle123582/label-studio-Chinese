---
title: Create a Prompt
short: Create a Prompt
tier: enterprise
type: guide
order: 0
order_enterprise: 228
meta_title: Create a Prompt
meta_description: How to create a Prompt
section: Prompts
date: 2024-06-11 16:53:16
---


## Prerequisites

* An [API key](prompts_keys) for your LLM. 
* A project that meets the [criteria noted below](#Create-a-Prompt). 

## Create a Prompt

From the Prompts page, click **Create Prompt** in the upper right and then complete the following fields:

<div class="noheader rowheader">

| | |
| --- | --- |
| Name | Enter a name for the Prompt. |
| Description | Enter a description for the Prompt.  |
| Target Project| Select the project you want to use. If you don't have any eligible projects, you will see an error message. <br>See the note below. <br><br>When you select a project, additional information about the labeling config appears. This includes the classes that will be used when applying the prompt.  |

</div>

!!! note Eligible projects
    Target projects must meet the following criteria:
    * You must have access to the project. If you are in the Manager role, you need to be added to the project to have access. 
    * The project cannot be located in your Personal Sandbox workspace. 
    * While projects connected to an ML backend will still appear in the list of eligible projects, we do not recommend using Prompts with an ML backend as this can interfere with how accuracy and score are calculated when evaluating the prompt. 
  
