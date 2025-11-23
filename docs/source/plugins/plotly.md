---
title: Data Visualization with Plotly
type: plugins
category: Visualization
cat: visualization
order: 200
meta_title: Data Visualization with Plotly
meta_description: Display a Plotly chart to annotators
tier: enterprise
---

<img src="/images/plugins/plotly-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     For information about modifying this plugin or creating your own custom plugins, see [Customize and Build Your Own Plugins](custom).

     For general plugin information, see [Plugins for projects](/guide/plugins) and [Plugin FAQ](faq).

## About

Use [Plotly](https://plotly.com/) to insert charts and graphs into your labeling interface. Charts are rendered in every annotation opened by a user. 

![Screenshot of Plotly graph in Label Studio](/images/plugins/plotly.png)

## Plugin

!!! note
    Plotly should be loaded first from CDN: https://cdn.plot.ly/plotly-2.26.0.min.js. For security reasons, it's better to use a hash for script integrity. 

```javascript
await LSI.import('https://cdn.plot.ly/plotly-2.26.0.min.js', 'sha384-xuh4dD2xC9BZ4qOrUrLt8psbgevXF2v+K+FrXxV4MlJHnWKgnaKoh74vd/6Ik8uF',);

let data = LSI.task.data;
if (window.Plotly && data) {
  Plotly.newPlot("plot", [data.plotly]);
}
```

**Related LSI instance methods:**

* [import(url, integrity)](custom#LSI-import-url-integrity)


## Labeling config

You need to add `<View idAttr="plot"/>` into your config to render the Plotly chart. 

For example:

```xml
<View>
  <Text name="function" value="Is it increasing?" />
  <Choices name="slope" toName="function">
    <Choice value="Increasing" />
    <Choice value="Decreasing" />
    <Choice value="Non-monotonic" />
  </Choices>
  <View idAttr="plot"/>
</View>
```

**Related tags:**

* [View](/tags/view.html)
* [Text](/tags/text.html)
* [Choices](/tags/choices.html)

## Sample data

```json
[
  {
    "plotly": {
      "x": [1, 2, 3, 4],
      "y": [10, 15, 13, 17],
      "type": "scatter"
    }
  },
  {
    "plotly": {
      "x": [1, 2, 3, 4],
      "y": [16, 5, 11, 9],
      "type": "scatter"
    }
  }
]
```
