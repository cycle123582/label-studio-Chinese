---
title: Plugins for projects
short: Plugins
tier: enterprise
type: guide
order: 0
order_enterprise: 140
meta_title: Plugins
meta_description: Use JavaScript to customize your labeling interface. 
section: "Create & Manage Projects"
date: 2024-07-30 10:39:03
---

You can extend your Labeling Configuration by implementing a custom JavaScript plugin.

Plugins (previously called "Custom Scripts") are defined in the project settings under the Labeling Interface section: 

![Screenshot of plugin panel](/images/plugins/plugin-panel.png)

!!! note
    Plugins are not available unless enabled. There are [important security considerations](#Security-notes-constraints-and-limitations) to understand before requesting access. To enable plugins for your organization, contact your account manager or go to **Project > Settings > Labeling Interface** and click **Request Access**. 

!!! error Enterprise
    Plugins are only available in Label Studio Enterprise. They are not available in Starter Cloud or Community editions. 

## Plugin examples

We provide out-of-the-box plugins that you can modify and use. You can also build your own custom plugins. 

For more information, see our [Plugins Gallery](/plugins) and [Customize and Build Your Own Plugins](/plugins/custom).

<a href="https://docs.humansignal.com/plugins/"><img src="/images/plugins/gallery.png" alt="Plugin gallery"></a>

## Use cases

Plugins allow you to enhance and tailor your labeling interface and workflow. For example:

* **General validation** – Plugins can be used to implement various validation checks to ensure the quality and consistency of annotations. 

    Examples: Data integrity checks, logical consistency checks, completeness checks. 

* **Incorporate dynamic elements** – Incorporate dynamic visualizations into the labeling interface to provide context or aid annotators in their tasks. 

    Examples: Charts or other data visualizations, insert custom options for tasks, real-time visual aids for annotations. 

* **Query external databases** – Enable dynamic querying of external databases to fetch data necessary for annotation tasks. 

    Examples: Retrieving contextual data, retrieving the latest data to populate choices

* **Workflow validations and customizations** – Use custom logic and validations to trigger subsequent workflows or actions based on the outcomes of the current annotation task.

    Examples: Feedback loops for annotators, conditional routing/assignment, progressive sampling, notifications regarding project progress. 

## Security notes, constraints, and limitations

Plugins are a powerful tool to help you fully customize your labeling workflow. In doing so you are running arbitrary JavaScript code on each annotator’s machine, which comes with certain risks. 

Because of this, you must opt-in before enabling plugins for your organization, and we urge you to use this feature with caution.

To enable plugins for your organization, you cannot have members that are in multiple organizations. This is enforced through application logic and is necessary for data security. The most common reason for this is when users have accounts in an expired free trial, but can also happen if you are using multiple organizations for project management or if you have an initial proof of concept or testing org. 


!!! note
    By default, only users who are in the Admin, Owner, or Manager role can access the project settings to view, add, and edit plugins. 
    
    You can optionally add a restriction so that only users in the Admin or Owner role can add or edit plugins. To request this, contact your account manager or [open a support ticket](mailto:support@humansignal.com).







