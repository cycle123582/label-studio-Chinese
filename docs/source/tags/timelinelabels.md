---
title: TimelineLabels
type: tags
order: 429
meta_title: TimelineLabels tag
meta_description: Classify video frames using TimelineLabels.
---

Use the TimelineLabels tag to classify video frames. This can be a single frame or a span of frames.

First, select a label and then click once to annotate a single frame. Click and drag to annotate multiple frames.

![Screenshot of video with frame classification](../images/timelinelabels.png)

Use with the `<Video>` control tag.

!!! info Tip
    You can increase the height of the timeline using the `timelineHeight` parameter on the `<Video>` tag.

{% insertmd includes/tags/timelinelabels.md %}

### Example
```html
<View>
  <Header>Label timeline spans:</Header>
  <Video name="video" value="$video" />
  <TimelineLabels name="timelineLabels" toName="video">
    <Label value="Nothing" background="#944BFF"/>
    <Label value="Movement" background="#98C84E"/>
  </TimelineLabels>
</View>
```
