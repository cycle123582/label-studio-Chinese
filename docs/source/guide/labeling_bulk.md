---
title: Bulk labeling
short: Bulk labeling
tier: enterprise
type: guide
order: 0
order_enterprise: 137
meta_title: Bulk Labeling
meta_description: Bulk labeling in Label Studio
section: "Create & Manage Projects"
parent: "labeling"
parent_enterprise: "labeling"
date: 2025-05-24 17:19:21
---

Bulk labeling is useful when you have a large set of tasks that share a common label or annotation that you want to apply in one go. For example:

* **Data classification**: Quickly label multiple tasks with the same category. 
* **Filtering and grouping**: Use filters to isolate tasks matching specific criteria (e.g., tasks you know are all “Approved”), then label them in bulk. 
* **Speed and consistency**: Avoid repetitive labeling for items that can confidently share a label.

## Supported data types

Bulk labeling supports all data types (e.g. images, text, audio, video). 

## Supported user roles

Only users who are in the Reviewer, Manager, Admin, or Owner role can use the bulk labeling actions available from the Data Manager. 

!!! info Tip
    Users in the Annotator role can still use [plugin-enabled bulk labeling actions](/plugins/bulk_labeling). 

## Supported labeling tasks

Bulk labeling supports classification tasks and text area input. 

You can use any combination of supported control tags, and all object tags (e.g. `<Image>`, `<Text>`, `<Video`) are supported. 

The following control tags can be assigned through the bulk labeling action:

* [Choices](/tags/choices.html)
* [DateTime](/tags/datetime.html)
* [Number](/tags/number.html)
* [Rating](/tags/rating.html)
* [Taxonomy](/tags/taxonomy.html)
* [TextArea](/tags/textarea.html)

If your labeling configuration includes control tags not listed above, the **Bulk labeling** action is not accessible. 
 

!!! note Limitations
    Note the following:
    * At this time, only global classification tasks are supported. This means that the control tag cannot have `perItem` or `perRegion` enabled. 
    * Lead time is not calculated for annotations performed through the bulk labeling option. 

## Bulk labeling panel 

When you perform bulk labeling, your options open in a side panel. Note that you can expand or collapse this panel as necessary by clicking the expand/collapse icons or by pressing `shift` + `.`.

![Gif opening and closing bulk label drawer](/images/label/bulk-expand.gif)

## List view

You can perform bulk labeling from the list view in the Data Manager. This is especially useful if you want to use filters to label a subset of results. 

Select the checkboxes next to the tasks you want to annotate and then click the drop-down menu next to **Label *n* Tasks**. Select **Bulk label**. This opens a panel with your labeling options (see [above](#Bulk-labeling-panel)).  

![Screenshot of Bulk label option from List view](/images/label/bulk-list-view.png)

Make your selections and click **Submit**, 

## Grid view

You can use the grid view to visually inspect and then select tasks for bulk annotation. 

To select tasks from the grid view, you can click the checkboxes next to them or open each and select tasks as you navigate through them. 

![Gif showing selecting images in grid view](/images/label/bulk-grid-navigating.gif)

Once selected, click the drop-down menu next to **Label *n* Tasks**. Select **Bulk label**. This opens a panel with your labeling options (see [above](#Bulk-labeling-panel)).

!!! info Tip
    There are hotkeys for selecting the task, scrolling, zooming, and navigating between tasks. To see a list of the available hotkeys, click the help icon above the task:

    ![Screenshot highlighting help icon](/images/label/bulk-hotkeys.png)
