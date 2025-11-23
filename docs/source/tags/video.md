---
title: Video
type: tags
order: 311
meta_title: Video Tag for Video Labeling
meta_description: Customize Label Studio with the Video tag for basic video annotation tasks for machine learning and data science projects.
---

Video tag plays a simple video file. Use for video annotation tasks such as classification and transcription.

Use with the following data types: video

### Video format

Label Studio relies on your web browser to play videos and evaluate the total frame number. So it's essential that your videos use a format and codecs that are universally supported. To ensure maximum compatibility, we recommend using an MP4 container with video encoded using the H.264 (AVC) codec and audio encoded with AAC. This combination is widely supported across all modern browsers and minimizes issues like incorrect total duration detection or problems with playback. In addition, it's important to convert your videos to a constant frame rate (CFR), ideally around 30 fps, to avoid discrepancies in frame counts and issues with duplicated or missing frames. 

All audio and video streams from your file must also have the same durations; otherwise, you will have extra total frames.

Converting your videos to this recommended format will help ensure that they play smoothly in Label Studio and that the frame rate and duration are correctly recognized for accurate annotations. To convert any video to this format, you can use FFmpeg. For example, the following commands convert an input video to MP4 with H.264 video, AAC audio, and a constant frame rate of 30 fps:

```bash
# Extract the exact video stream duration in seconds
DUR=$(ffprobe -v error -select_streams v:0 -show_entries stream=duration -of default=nokey=1:noprint_wrappers=1 input.mp4)
# Re-encode media file to recommended format
ffmpeg -i input_video.mp4 -c:v libx264 -profile:v high -level 4.0 -pix_fmt yuv420p -r 30 -c:a aac -b:a 128k -to $DUR output_video.mp4
```

In this command:
- `-i input_video.mp4` specifies your source video.
- `-c:v libx264` uses the H.264 codec for video encoding.
- `-profile:v high -level 4.0` sets compatibility parameters for a broad range of devices.
- `-pix_fmt yuv420p` ensures the pixel format is compatible with most browsers.
- `-r 30` forces a constant frame rate of 30 fps. You can also omit the -r option, ffmpeg will save your current frame rate. This is fine if you are 100% certain that your video has a constant frame rate.
- `-c:a aac -b:a 128k` encodes the audio in AAC at 128 kbps.
- `-to` stops writing output as soon as the container clock hits your video’s end timestamp, so any extra audio tail is automatically dropped.
- `output_video.mp4` is the converted video file ready for use in Label Studio.

Using this FFmpeg command to re-encode your videos will help eliminate playback issues and ensure that Label Studio detects the total video duration  accurately, providing a smooth annotation experience.

It is a good idea to check all parameters of your video using this command:
```bash
ffprobe -v error -show_format -show_streams -print_format json input.mp4
```

{% insertmd includes/tags/video.md %}

### Example

Labeling configuration to display a video on the labeling interface

```html
<View>
  <Video name="video" value="$video" />
</View>
```
### Example

Video with custom playback speed settings

```html
<View>
  <Video name="video" value="$video" defaultPlaybackSpeed="2" minPlaybackSpeed="1.5" />
</View>
```

### Example

Video classification

```html
<View>
  <Video name="video" value="$video" />
  <Choices name="ch" toName="video">
    <Choice value="Positive" />
    <Choice value="Negative" />
  </Choices>
</View>
```
### Example

Video transcription

```html
<View>
  <Video name="video" value="$video" />
  <TextArea name="ta" toName="video" />
</View>
```
