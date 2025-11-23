---
title: Multi-Frame Video View
type: plugins
category: Visualization
cat: visualization
order: 240
meta_title: Multi-Frame Video View
meta_description: Synchronizes multiple video views to display a video with different frame offsets
tier: enterprise
---

<img src="/images/plugins/frame-offset-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     For information about modifying this plugin or creating your own custom plugins, see [Customize and Build Your Own Plugins](custom).

     For general plugin information, see [Plugins for projects](/guide/plugins) and [Plugin FAQ](faq).

## About

This labeling configuration arranges three video players vertically, making it easier to view and annotate each video frame. 

The plugin ensures the videos are synced, with one player showing one frame forward, and another player the previous frame. 

![Screenshot of video sync labeling config](/images/plugins/video_sync.png)

## Plugin

```javascript
/**
 * Multi-frame video view plugin
 *
 * This plugin synchronizes three video views to display a video with three frames:
 * -1 frame, 0 frame, and +1 frame.
 *
 * It also synchronizes the timeline labels to the 0 frame.
 */

async function initMultiFrameVideoView() {
	// Wait for the Label Studio Interface to be ready
	await LSI;

	// Get references to the video objects by their names
	const videoMinus1 = LSI.annotation.names.get("videoMinus1");
	const video0 = LSI.annotation.names.get("video0");
	const videoPlus1 = LSI.annotation.names.get("videoPlus1");

	if (!videoMinus1 || !video0 || !videoPlus1) return;

	// Convert frameRate to a number and ensure it's valid
	const frameRate = Number.parseFloat(video0.framerate) || 24;
	const frameDuration = 1 / frameRate;

	// Function to adjust video sync with offset and guard against endless loops
	function adjustVideoSync(video, offsetFrames) {
		video.isSyncing = false;

		for (const event of ["seek", "play", "pause"]) {
			video.syncHandlers.set(event, (data) => {
				if (!video.isSyncing) {
					video.isSyncing = true;

					if (video.ref.current && video !== video0) {
						const videoElem = video.ref.current;

						adjustedTime =
							(video0.ref.current.currentFrame + offsetFrames) * frameDuration;
						adjustedTime = Math.max(
							0,
							Math.min(adjustedTime, video.ref.current.duration),
						);

						if (data.playing) {
							if (!videoElem.playing) videoElem.play();
						} else {
							if (videoElem.playing) videoElem.pause();
						}

						if (data.speed) {
							video.speed = data.speed;
						}

						videoElem.currentTime = adjustedTime;
						if (
							Math.abs(videoElem.currentTime - adjustedTime) >
							frameDuration / 2
						) {
							videoElem.currentTime = adjustedTime;
						}
					}

					video.isSyncing = false;
				}
			});
		}
	}

	// Adjust offsets for each video
	adjustVideoSync(videoMinus1, -1);
	adjustVideoSync(videoPlus1, 1);
	adjustVideoSync(video0, 0);
}

// Initialize the plugin
initMultiFrameVideoView();
```

**Related LSI instance methods:**

* [annotation](custom#LSI-annotation)

## Labeling config

Each video is wrapped in a `<View>` tag with a width of 100% to ensure they stack on top of each other. The `Header` tag provides a title for 
each video, indicating which frame is being displayed. 

The `Video` tags are used to load the video content, with the `name` attribute uniquely identifying each video player. 

The `TimelineLabels` tag is connected to the second video (`video0`), allowing annotators to label specific segments of that video. The labels `class1` and `class2` can be used to categorize the content of the video, enhancing the  annotation process. 

```xml
<View>
  <View style="display: flex">
  <View style="width: 100%">
    <Header value="Video -1 Frame"/>
    <Video name="videoMinus1" value="$video_url" 
           height="200" sync="lag" frameRate="29.97"/>
  </View>
  <View style="width: 100%">
    <Header value="Video +1 Frame"/>
    <Video name="videoPlus1" value="$video_url" 
           height="200" sync="lag" frameRate="29.97"/>
  </View>
  </View>
  <View style="width: 100%; margin-bottom: 1em;">
    <Header value="Video 0 Frame"/>
    <Video name="video0" value="$video_url"
           height="400" sync="lag" frameRate="29.97"/>
  </View>
  <TimelineLabels name="timelinelabels" toName="video0">
    <Label value="class1"/>
    <Label value="class2"/>
  </TimelineLabels>
</View>
```

**Related tags:**

* [View](/tags/view.html)
* [Video](/tags/video.html)
* [TimelineLabels](/tags/timelinelabels.html)
* [Label](/tags/label.html)

## Sample data

```json
[
  {
    "video": "/static/samples/opossum_snow.mp4"
  }
]
```