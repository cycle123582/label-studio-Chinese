// Test configurations with multiple label blocks for each object tag
export const imageRectangleLabelsConfig = `
<View>
  <Image name="img" value="$image"/>
  <RectangleLabels name="shapes" toName="img">
    <Label value="Circle" background="red"/>
    <Label value="Rectangle" background="blue"/>
  </RectangleLabels>
  <RectangleLabels name="objects" toName="img">
    <Label value="Star" background="green"/>
    <Label value="Planet" background="yellow"/>
  </RectangleLabels>
  <Labels name="general" toName="img">
    <Label value="Visible" background="purple"/>
    <Label value="Hidden" background="gray"/>
  </Labels>
</View>
`;

export const imagePolygonLabelsConfig = `
<View>
  <Image name="img" value="$image"/>
  <PolygonLabels name="areas" toName="img">
    <Label value="Area1" background="red"/>
    <Label value="Area2" background="blue"/>
  </PolygonLabels>
  <PolygonLabels name="regions" toName="img">
    <Label value="Region1" background="green"/>
    <Label value="Region2" background="yellow"/>
  </PolygonLabels>
  <Labels name="tags" toName="img">
    <Label value="Tagged" background="purple"/>
    <Label value="Untagged" background="gray"/>
  </Labels>
</View>
`;

export const richTextLabelsConfig = `
<View>
  <Text name="text" value="$text"/>
  <Labels name="entities" toName="text">
    <Label value="Animal" background="red"/>
    <Label value="Color" background="blue"/>
  </Labels>
  <Labels name="sentiments" toName="text">
    <Label value="Fast" background="green"/>
    <Label value="Slow" background="orange"/>
  </Labels>
</View>
`;

export const paragraphsLabelsConfig = `
<View>
  <Paragraphs name="paragraphs" value="$paragraphs"/>
  <ParagraphLabels name="topics" toName="paragraphs">
    <Label value="Introduction" background="lightblue"/>
    <Label value="Conclusion" background="lightgreen"/>
  </ParagraphLabels>
  <ParagraphLabels name="importance" toName="paragraphs">
    <Label value="High" background="red"/>
    <Label value="Low" background="gray"/>
  </ParagraphLabels>
</View>
`;

export const audioLabelsConfig = `
<View>
  <Audio name="audio" value="$audio"/>
  <Labels name="speakers" toName="audio">
    <Label value="Speaker1" background="red"/>
    <Label value="Speaker2" background="blue"/>
  </Labels>
  <Labels name="emotions" toName="audio">
    <Label value="Happy" background="green"/>
    <Label value="Sad" background="gray"/>
  </Labels>
</View>
`;

export const timeseriesLabelsConfig = `
<View>
  <TimeSeries name="ts" value="$timeseries" valueType="json" timeColumn="time">
    <Channel column="events"/>
    <Channel column="patterns"/>
  </TimeSeries>
  <TimeSeriesLabels name="events" toName="ts">
    <Label value="Peak" background="red"/>
    <Label value="Valley" background="blue"/>
  </TimeSeriesLabels>
  <TimeSeriesLabels name="patterns" toName="ts">
    <Label value="Trend" background="green"/>
    <Label value="Noise" background="gray"/>
  </TimeSeriesLabels>
</View>
`;

export const videoLabelsConfig = `
<View>
  <Video name="video" value="$video"/>
  <VideoRectangle name="box" toName="video"/>
  <Labels name="objects" toName="video">
    <Label value="Person" background="red"/>
    <Label value="Car" background="blue"/>
  </Labels>
  <Labels name="actions" toName="video">
    <Label value="Walking" background="green"/>
    <Label value="Running" background="yellow"/>
  </Labels>
</View>
`;

export const videoTimelineLabelsConfig = `
<View>
  <Video name="video" value="$video"/>
  <TimelineLabels name="events" toName="video">
    <Label value="Start" background="red"/>
    <Label value="End" background="blue"/>
  </TimelineLabels>
  <TimelineLabels name="activities" toName="video">
    <Label value="Movement" background="green"/>
    <Label value="Stillness" background="orange"/>
  </TimelineLabels>
</View>
`;

export const hyperTextLabelsConfig = `
<View>
  <HyperText name="hypertext" value="$hypertext"/>
  <HyperTextLabels name="elements" toName="hypertext">
    <Label value="Header" background="red"/>
    <Label value="Paragraph" background="blue"/>
  </HyperTextLabels>
  <HyperTextLabels name="semantic" toName="hypertext">
    <Label value="Important" background="green"/>
    <Label value="Secondary" background="gray"/>
  </HyperTextLabels>
</View>
`;

// Test data
export const testImageData = {
  image:
    "https://htx-pub.s3.us-east-1.amazonaws.com/examples/images/nick-owuor-astro-nic-visuals-wDifg5xc9Z4-unsplash.jpg",
};

export const testTextData = {
  text: "The quick brown fox jumps over the lazy dog. This sentence contains many different letters.",
};

export const testHyperTextData = {
  hypertext:
    "<article><h2>Sample Article</h2><p>The quick <strong>brown fox</strong> jumps over the lazy dog. This sentence contains many different letters.</p></article>",
};

export const testParagraphsData = {
  paragraphs: [
    {
      author: "Speaker A",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      author: "Speaker B",
      text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      author: "Speaker A",
      text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    },
  ],
};

export const testAudioData = {
  audio: "/public/files/barradeen-emotional.mp3",
};

const timeseriesTime = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const testTimeseriesData = {
  timeseries: {
    time: timeseriesTime,
    events: timeseriesTime.map((t) => 100 * Math.sin(t / 2)),
    patterns: timeseriesTime.map((t) => 100 * Math.cos(t / 3)),
  },
};

export const testVideoData = {
  video: "/public/files/opossum_intro.webm",
};
