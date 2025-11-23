---
title: Video Frame Classification
type: templates
category: Videos
cat: videos
order: 705
is_new: t
meta_title: Video Frame Classification
meta_description: Template for classifying frames within a video.
---

<img src="/images/templates/video-frame-classification.png" alt="" class="gif-border" width="552px" height="408px" />

Video frame classification is the process of assigning labels to individual frames within a video. This technique is useful when you need to analyze specific moments or events in a video, such as detecting actions, states, or changes over time, rather than classifying the entire video as a whole.

<iframe width="560" height="315" src="https://www.youtube.com/embed/DsTsbg5NSWQ?si=uOfseQ1CNJ_-uIGv" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Labeling configuration

```xml
<View>
   <TimelineLabels name="videoLabels" toName="video">
     <Label value="Movement" background="#c813ec"/>
     <Label value="Still" background="#1d81cd"/>
     <Label value="Slow Motion" background="#54d651"/>
   </TimelineLabels>
   <Video name="video" value="$video" frameRate="25.0" timelineHeight="120" />
</View>
```

## About the labeling configuration

#### <View>

All labeling configurations must be wrapped in `<View>` tags.

#### Video object tag

Use the `<Video>` object tag to specify the video data. 

* The `frameRate` parameter sets the frame rate of the video. Ensure this matches the video's framerate. If your video has defects or variable framerate, it might cause discrepancies. Transcoding the video to a constant framerate before uploading can help.
* Use `timelineHeight` to control the height of your timeline where you are selecting frames. 
  
For more parameters, see the [Video tag page](/tags/video). 

```xml
  <Video name="video" value="$video" frameRate="25.0" timelineHeight="120"/>
```

#### TimelineLabels control tag

Use the [TimelineLabels control tag](/tags/timelinelabels) to define labels that can be applied to specific frames of the video. 

Use `Label` tags within `TimelineLabels` to define the labels that you want to use. 

```xml
<TimelineLabels name="videoLabels" toName="video">
     <Label value="Movement" background="#c813ec"/>
     <Label value="Still" background="#1d81cd"/>
     <Label value="Slow Motion" background="#54d651"/>
</TimelineLabels>
```

## Input data format

Prepare your input data with the video field pointing to your video URL. If you want to test out a video, you can use a JSON file with the following example:

```json
[
  {
    "video": "/static/samples/opossum_snow.mp4"
  }
]
```


## Related Tags
- [TimelineLabels](/tags/timelinelabels.html)
- [Video](/tags/video.html)
- [Label](/tags/label.html)
- [Example of ML Backend for Frame Classification](https://github.com/HumanSignal/label-studio-ml-backend/blob/master/label_studio_ml/examples/yolo/README_TIMELINE_LABELS.md)