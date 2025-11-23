// Video + Audio + Paragraphs synchronization test configuration
export const videoAudioParagraphsConfig = `
<View>
  <Video name="video" value="$url" sync="sync1" height="150"/>
  <Audio name="audio" value="$url" hotkey="space" sync="sync1" />
  <Header value="Sentiment"/>
  <ParagraphLabels name="label" toName="text">
    <Label value="General: Positive" background="#00ff00"/>
    <Label value="General: Negative" background="#ff0000"/>
    <Label value="Company: Positive" background="#7dff7d"/>
    <Label value="Company: Negative" background="#ff7d7d"/>
    <Label value="External: Positive" background="#4bff4b"/>
    <Label value="External: Negative" background="#ff4b4b"/>
  </ParagraphLabels>
  <View style="height: 400px; overflow-y: auto">
    <Header value="Transcript"/>
    <Paragraphs audioUrl="$url" name="text" value="$text" layout="dialogue" textKey="text" nameKey="author" showplayer="true" sync="sync1" />
  </View>
</View>
`;

export const videoAudioParagraphsData = {
  url: "/public/files/opossum_intro.webm",
  text: [
    {
      end: 3,
      text: "Dont you hate that?",
      start: 1,
      author: "Mia Wallace",
    },
    {
      text: "Hate what?",
      start: 3,
      author: "Vincent Vega:",
      duration: 1,
    },
    {
      text: "Uncomfortable silences. Why do we feel its necessary to yak about nonsense in order to be comfortable?",
      author: "Mia Wallace:",
      start: 4,
      end: 6,
    },
    {
      text: "I dont know. Thats a good question.",
      start: 6,
      end: 8,
      author: "Vincent Vega:",
    },
    {
      text: "Thats when you know you found somebody really special. When you can just shut the door closed a minute, and comfortably share silence.",
      author: "Mia Wallace:",
      start: 8,
      end: 10,
    },
  ],
};

export const videoAudioParagraphsAnnotations = [
  {
    value: {
      start: "0",
      end: "0",
      startOffset: 0,
      endOffset: 4,
      text: "Dont",
      paragraphlabels: ["General: Negative"],
    },
    id: "RcHv5CdYBt",
    from_name: "label",
    to_name: "text",
    type: "paragraphlabels",
    origin: "manual",
  },
  {
    value: {
      start: "0",
      end: "0",
      startOffset: 9,
      endOffset: 13,
      text: "hate",
      paragraphlabels: ["General: Positive"],
    },
    id: "eePG7PVYH7",
    from_name: "label",
    to_name: "text",
    type: "paragraphlabels",
    origin: "manual",
  },
];

export const fullOpossumSnowData = {
  url: "/public/files/opossum_snow.mp4",
  text: [
    {
      start: 5.528639507357505,
      end: 6.70534554273317,
      text: "Mahna Mahna",
      author: "Mahna Mahna",
    },
    {
      start: 8.202614379084968,
      end: 9.281045751633988,
      text: "Mahna Mahna",
      author: "Mahna Mahna",
    },
    {
      start: 10.898692810457517,
      end: 11.998910675381264,
      text: "Mahna Mahna",
      author: "Mahna Mahna",
    },
    {
      start: 17.467320261437912,
      end: 18.567538126361658,
      text: "Mahna Mahna",
      author: "Mahna Mahna",
    },
    {
      start: 20.21786492374728,
      end: 21.045751633986928,
      text: "Mahna Mahna",
      author: "Mahna Mahna",
    },
    {
      start: 22.875816993464056,
      end: 23.69281045751634,
      text: "Mahna Mahna",
      author: "Mahna Mahna",
    },
    {
      start: 34.869281045751634,
      end: 35.55555555555556,
      text: "Mahna Mahna",
      author: "Mahna Mahna",
    },
    {
      start: 37.48793583224401,
      end: 38.413861758169936,
      text: "Mahna Mahna",
      author: "Mahna Mahna",
    },
    {
      start: 40.12410140958606,
      end: 41.2569990130719,
      text: "Mahna Mahna",
      author: "Mahna Mahna",
    },
  ],
};
