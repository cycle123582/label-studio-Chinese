---
title: Time Series Labeling with Audio and Video Synchronization
type: templates
category: Time Series Analysis
cat: time-series-analysis
order: 615
meta_title: Time Series + Audio + Video Data Labeling Template
meta_description: Template for time series synchronization with audio and video.
---

<img src="/images/templates/timeseries_audio_video.png" alt="" class="gif-border" width="552px" height="408px" />

This template demonstrates the synchronization of media streams with the corresponding sensor data by mapping audio or video frames to the appropriate time-series timestamps. For example:

<video src="https://htx-pub.s3.us-east-1.amazonaws.com/docs/timeseries-video-audio-sync.mp4" controls style="max-width:800px" />

!!! note
    **Requirements:** Label Studio >= 1.20

### Time units and syncing

All sync messages use relative seconds from the start of each component. 

There are two types of configurations, and configuration you use determines how the time series converts the relative seconds:

- **Time-based**: Converts to absolute timestamps
- **Index-based**: Uses relative seconds as indices


## Handling length, duration, sample and frame rate mismatches

**Timeseries length and video duration**

You may have mismatched lengths in your data. When this occurs:

- Sync works up to the length of the shorter component.
- Components stop at their respective ends; however, other components with a longer length/duration can continue playing.

**Timeseries sample rate and video frame rate**

!!! attention
    It's extremely important to set `frameRate` for your video. Otherwise, you will get incorrect labeling synchronization between timeseries and video.
  
We recommend converting your video using these scripts: https://labelstud.io/tags/video#Video-format.

Also, it is recommended to use integer multiples for sample rates and frame rates in your time series, audio, and videos. This approach simplifies aligning samples and frames and allows for smooth navigation across various media sources. For example, if the video frame rate is _30 frames per second_, having _60 (or 90, 120, ...) samples per second_ for the time series is beneficial.


## Time-based time series

* Maintains precise temporal alignment with video, audio and other timeseries
* Converts relative seconds to absolute timestamps.
* **Offset behaviour:** The very first timestamp in the timeseries is treated as *t = 0* for every synced media. For example, if the earliest sample in the CSV is at absolute 5 s, then:
    - `timeSeries[0]` = **5 s** (absolute) → considered **0 s** in sync space.  
    - When you click at 2 s on the timeseries, the video will seek to *5 s + 2 s = 7 s* of real video time.
    - Conversely, seeking to 0 s in the video will position the playhead at the first timeseries sample (5 s absolute).
    - This constant offset is applied in every direction (seek / play / pause) and guarantees perfect alignment regardless of how the raw clocks are shifted.

To specify a time-based time series, use the following format:
  
```xml
   <TimeSeries name="ts" timeColumn="timestamp" timeFormat="%Y-%m-%d %H:%M:%S">
```

**Use time-based time series when:**

- Data has actual timestamps.
- Precise temporal alignment is needed.
- Working with multiple media types.

#### Labeling Configuration

* Time-based TimeSeries
* Multiple TimeSeries, Audio and Video are synced together
* TimeSeriesLabels are used as control tag for labeling

```html
<View>
  <Video name="video" value="$video" frameRate="30" sync="group_a"/>
  <!-- <Audio name="audio" value="$video" sync="group_a"/> -->
  
  <TimeSeriesLabels name="timelinelabels" toName="accel_timeseries">
    <Label value="A"/>
    <Label value="B"/>
  </TimeSeriesLabels>  

  <TimeSeries 
              name="accel_timeseries"
              value="$accel_data"
              sync="group_a"
              timeColumn="time"
              timeFormat="%H:%M:%S.%f"
              timeDisplayFormat="%H:%M:%S.%f"
              overviewWidth="10%"
              fixedScale="true"
  >
    <MultiChannel>
      <Channel column="accel_x" strokeColor="#FF0000" height="100"/>
      <Channel column="accel_y" strokeColor="#00FF00" height="100"/>
    </MultiChannel>
  </TimeSeries>
  
  <TimeSeries 
              name="gyro_timeseries" 
              value="$gyro_data" 
              sync="group_a"
              timeColumn="time"
              timeFormat="%H:%M:%S.%f"
              timeDisplayFormat="%H:%M:%S.%f"
              overviewWidth="10%"
              fixedScale="true"
  >
    <Channel column="gyro_x" strokeColor="#0000FF" height="100"/>
    <Channel column="gyro_y" strokeColor="#FF00FF" height="100"/>
  </TimeSeries> 

</View>

<!-- {
  "video": "https://app.heartex.ai/static/samples/opossum_snow.mp4",
  "accel_data": "https://app.humansignal.com/samples/time-series.csv?time=time&values=accel_x%2Caccel_y&sep=%2C&tf=%H:%M:%S.%f",
  "gyro_data": "https://app.humansignal.com/samples/time-series.csv?time=time&values=gyro_x%2Cgyro_y&sep=%2C&tf=%H:%M:%S.%f"
}
-->
```

{% details <b>Example for time-series-accel.csv for accel_x, accel_y</b> %}

```csv
time,accel_x,accel_y
00:01:01.000000,-0.056646571671882806,2.1066649495524605
00:01:02.000000,-0.6888765232989033,0.35646668995794306
00:01:03.000000,-0.23512086306647553,0.5799351613084716
00:01:04.000000,-0.9314772647682944,-0.5195693066279311
00:01:05.000000,1.321119143958512,-0.622026749003922
00:01:06.000000,0.10592100887528152,0.15477501359739493
00:01:07.000000,-0.6261150686384155,0.5624264458111049
00:01:08.000000,1.0829322997587332,-1.9590268928992862
00:01:09.000000,-1.2267135177322928,-0.4538764395229617
00:01:10.000000,1.6705781810127622,0.38407182850093363
```

{% enddetails %}

{% details <b>Example for time-series-gyro.csv for gyro_x, gyro_y</b> %}

```csv
time,gyro_x,gyro_y
00:01:01.000000,-0.776563940219835,-1.1115451852904443
00:01:02.000000,0.17111212343134966,-1.377696478819913
00:01:03.000000,-1.168085910547026,-0.8500307427257534
00:01:04.000000,-0.13947878605597916,0.9062482653127198
00:01:05.000000,0.3079887618179474,-1.6722497873634719
00:01:06.000000,-0.3825838786476411,-1.242585234780504
00:01:07.000000,-0.7015245817392025,-1.712515499827561
00:01:08.000000,-0.3437952109000775,-0.9337512501019165
00:01:09.000000,-0.19464021971045084,-0.9653381620475747
00:01:10.000000,-0.29753925483100785,-0.7699832734123578
```

{% enddetails %}


## Index-based time series

- Uses direct indices as relative seconds
- Each second in media = one index in the time series, sampling rate is always 1 Hz
- Suitable mostly for debugging and tests
- Example: 30s in video = index 30 in the time series

To specify an index-based time series, use the following format:

```xml
   <TimeSeries name="ts">
```

**Use index-based time series when:**
- Data is sequential.
- No actual timestamps are available.
- Simple 1 sample <=> 1 second mapping with media time is sufficient.


#### Labeling configuration

<br>

{% details <b>Index-based TimeSeries (no timestamps at X axis)</b> %}

* Index-based TimeSeries + Video + TimeSeriesLabels
* One value equals one second because the time axis is not specified in the `TimeSeries` tag. The video is synced with this idea — one sample equals one second if timestamps are not provided.


```html
<View>
  <Video name="video" value="$video" frameRate="30" sync="group_a"/>
  
  <TimeSeries name="timeseries"
              value="$ts" valueType="json"
              sync="group_a" sep=","
              overviewWidth="10%"
              fixedScale="true"
              >
    <Channel column="value" strokeColor="#FF0000"/>
    <Channel column="value" strokeColor="#00FF00"/>
  </TimeSeries>
  
  <TimeSeriesLabels name="labels" toName="timeseries">
    <Label value="action"/>
    <Label value="pause"/>
  </TimeSeriesLabels>

</View>

<!-- {
  "video": "https://app.heartex.ai/static/samples/opossum_snow.mp4",
  "ts": {
      "value": [
        10.7036820361892644,
        -0.18120536109567212,
        -0.39251488391214157,
        1.3384817293995075,
        0.8779675446349394,
        -0.1511946071051955,
        -0.7955547028255082,
        1.0736798948078534,
        1.1266164855584428,
        -0.440291574562604,
        -0.8436786901744359,
        -0.24956239687939094,
        1.268049926141147,
        0.6300808834120004,
        1.7946935071842107,
        -0.37700464705843,
        0.706518542026297,
        -0.45787451607104046,
        -2.3643354623876607,
        0.13984274721398307,
        0.3174445171792305,
        -1.8162371732091722,
        -0.30289394872251374,
        -0.730112449190387,
        -1.6852497246079239,
        -1.0473893262227658,
        0.10416951356137397,
        -2.0266185534759633,
        -0.05196549263706541,
        0.4436085233243668,
        -0.0956064205420074,
        -1.1790065141112944,
        -0.015063840978932763,
        0.28691755509866407,
        1.4122332721986657,
        0.40127732957527523,
        1.546243544663401,
        0.11119508061291504,
        -0.499517691828469,
        -0.02922576888373752,
        -0.8454178734108769,
        0.19122400060485445,
        0.6914340334390281,
        -0.18047241277757645,
        -0.6394589243120249,
        1.0019886671810008
      ]
  }
} -->
```

{% enddetails %}
