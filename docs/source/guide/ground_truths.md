---
title: Ground truth annotations
short: Ground truth annotations
tier: enterprise
type: guide
order: 0
order_enterprise: 305
meta_title: Ground truth annotations
meta_description: Set ground truth annotations in Label Studio Enterprise. 
section: "Review & Measure Quality"
date: 2024-09-30 13:57:28
---

A "ground truth" annotation is a verified, high-quality annotation that serves as the correct answer for a specific task. It acts as a benchmark to assess the accuracy of other annotations and the performance of machine learning models.

Label Studio Enterprise compares annotations from annotators and model predictions against the ground truth annotations for a task to calculate an accuracy score between 0 and 1.

!!! error Enterprise
    Ground truth annotations are only available in Label Studio Enterprise Edition. If you're using Label Studio Community Edition, see [Label Studio Features](https://labelstud.io/guide/label_studio_compare.html) to learn more.

## Mark an annotation as a ground truth

Open the task to review its annotations. Click the star icon at the bottom to set a specific annotation as the ground truth:

![screenshot of ground truth](/images/review/ground_truth.png)

!!! note
    A task can only have one annotation set as the ground truth annotation for the task. If you set a new annotation for a task as a ground truth, the previous annotation for that task set as a ground truth is updated to no longer be a ground truth annotation.

## Set ground truths by user

To bulk update tasks to ensure that annotations from a specific annotator should be considered ground truth, first select the tasks you want to update. 

Then select **Actions >Set Ground Truths**. You can then select from a list of annotators. 

![screenshot of ground truth column](/images/review/ground-truth-set.png)

## Review existing ground truth annotations

You can identify which tasks already have a ground truth using the **Ground Truth** column in the Data Manager:

![screenshot of ground truth column](/images/review/ground_truth_dm.png)

You can also use a filter to include or exclude tasks that have ground truths set. 

## View ground truths in the inter-annotator agreement popover

Hover over the **Agreement** column to view a pop-over showing inter-annotator agreement. Annotations that have been marked ground truth are indicated with a star icon ⭐️:

<img src="/images/review/iaa-popover.png" alt="" class="gif-border" style="max-width:705px" />


## Remove ground truth annotations

To remove a single ground truth annotation, simply open the task and click the star icon again to unset it. 

To remove multiple ground truth annotations, select the checkboxes next to the tasks in the Data Manager and then select **Actions > Delete Ground Truths**. 

