---
title: Customize and Build Your Own Plugins
short: Custom Plugins
type: plugins
category: Overview
cat: overview
order: 8
meta_title: Plugins Frequently Asked Questions
tier: enterprise
---

You can modify the plugin examples that we provide or build your own custom plugins. 

Plugins are authored in JavaScript and are project-specific. They are limited to specific tasks and the annotation workflow and cannot, for example, be used to create new pages or otherwise extend the core functionality of Label Studio. 

!!! note
    Plugins are not available unless enabled. There are [important security considerations](/guide/plugins#Security-notes-constraints-and-limitations) to understand before requesting access.  

## Execution

Plugins are executed each time the annotation is displayed.  For example, when you open a task, move between tasks, create a new annotation, switch between annotations, create a new annotation, and view older versions of the annotation. 

This means that for each annotation you can add specific behavior. However, it also means that if you don’t plan accordingly when constructing your plugin logic, you could end up with repetitive actions.

To avoid multiple event subscriptions (and, consequently, multiple handler triggers), it is best to use `LSI.on()` because the handlers that are added using this method will be unsubscribed after the current annotation is closed. For more information on LSI, [see below](#Label-Studio-Interface-LSI). 

!!! note
    Because plugins can be executed multiple times for the same annotation, you need to take measures to avoid issues such as infinite loops, memory leaks, and application crashes. For this reason, we recommend that each script run cleans up the previous run, meaning that event handlers should be stored in a global register along with their parameters so that they can be checked, stopped, or adjusted. Every handler should check whether it is still running over the current version of annotation/data in case it has changed.

    However, handlers attached via `LSI.on()` are safe and will automatically handle this clean up process.

!!! info Tip
    Plugins are executed within an asynchronous function, so you can use `await` as necessary. 

## Troubleshooting and debugging

It is important to test and refine plugins using a test project first to avoid any disruptions on live projects. 

When you add a plugin, the **Testing** panel appears below the script field. You can use this to test the plugin with sample data, manually trigger events, and see what events are triggered as you interact with the sample data. 

<video src="../images/plugins/test.mp4" controls="controls" style="max-width: 800px;" class="gif-border" />

Note the following:

* The **Testing** panel does not appear until you add a plugin and does not appear if you have validation errors in your labeling config, so check the **Code** panel to ensure there are no errors. 
* You can also use the Console tab in your web browser’s developer tools to check for errors and verify the plugin is running. 
* You can check the Network tab (plugin information is returned with the `/project/:id` API call).
* If necessary, you can add [`debugger`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger) to your script to have a convenient breakpoint to debug the plugin using your web browser’s developer tools. 

## Label Studio Interface (LSI)

The Label Studio Interface (LSI) is a helper object that is designed to be used with plugins. 

LSI simplifies access to some data and can perform special actions that only make sense within the framework of plugins.

### Instance methods

##### `LSI.import(url, integrity)`

Allows loading additional external scripts

| Parameter  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; | Type     | Description          |
|--------------------------|--------------------|--------------------------|
| `url` | string | Specifies the URL of an external script file.                                 |
| `integrity`  | string | Allows a browser to check the fetched script to ensure that the code is never loaded if the source has been manipulated.  |

The method is asynchronous, so you can wait for the script to load before performing the main actions. For example:

```javascript
await LSI.import('https://cdn.plot.ly/plotly-2.26.0.min.js', 'sha384-xuh4dD2xC9BZ4qOrUrLt8psbgevXF2v+K+FrXxV4MlJHnWKgnaKoh74vd/6Ik8uF');
console.log("Plotly is ready");
```

##### `LSI.on(eventName, handler)`

Subscription to listen to events related to the Label Studio Frontend. Handlers attached/subscribed using this method will be unsubscribed when switching to another annotation. Any handlers inside this method should be secured manually.

For a list of all available events, see our [Frontend reference](/guide/frontend_reference#Available-events).

!!! note
    Top-level events such as `labelStudioLoad` and `storageInitialized` cannot be used with plugins, as they execute before the script is initialized.

| Parameter &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; | Type     | Description          |
|--------------------------|--------------------|--------------------------|
| `eventName` | string | A case-sensitive string representing the event type to listen for.                  |
| `handler`  | function | A function that will be called when the event is triggered. This function can take arguments depending on the event.  |


##### `LSI.dataObj`

Alias to `.task.data`. This is the core data structure for a task, and includes the original data that needs to be annotated.

##### `LSI.task`

A getter that returns information about current task:
* `id` - ID of the task. 
* `data` - Object representing task data. 

##### `LSI.annotation`

A getter that returns the currently selected annotation.

##### `LSI.regions`

A getter that returns all regions of the current annotation.


## Frontend API implementation details

The following implementation details may be useful when creating your own plugins. 

!!! note
    While these details are relatively stable, we make no guarantees that they will not change in the future. 

For more information on how annotations are stored and formatted, see [How Label Studio saves results in annotations](/guide/task_format#How-Label-Studio-saves-results-in-annotations). 

### Regions


##### `.areas` 

Map of regions.

##### `.regions` 

An array of all regions (includes classifications). 

##### `.regionStore.regions` 

An array of all real regions (excludes classifications).

##### `.results` 

Array of all results. 

Note that this returns an array of objects with keys of all possible result types, but only one result type has an actual value. To access this value directly, use `result.mainValue` (which works as a shortcut for `r[control.valueType]`).

### Labels

!!! note
    `region` is retrieved by `.region` (see above).

##### `region.labelings` 

Array of all labeling results for this region.

##### `region.labeling` 

The first labeling result.

##### `region.labels` 

An array of label texts from `labeling`, but does not include other labeling results. 

##### `region.labelName` 

The label text of the first label in the first labeling result. 

##### `region.labeling.selectedLabels` 

An array of `<Label>` tags connected to every label in `labeling`. 

For example, to retrieve the label color you can use `region.labeling.selectedLabels[0].background`. 

##### `region.labeling.getSelectedString(joinStr = " ")` 

Returns a string with all labels in `labeling`. By default, these are concatenated with the param followed by a space (e.g. `“A B”`).

##### `region.getLabelText()` 

Returns a string with comma-separated list of labels in `labeling`, with optional text of the first per-region TextArea result. Formatted as follows: `“A,B: text”`