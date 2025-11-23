export const audioErrorsConfig = `
  <View>
    <Header value="Select regions:"></Header>
    <Labels name="label" toName="audio" choice="multiple">
      <Label value="Beat" background="yellow"></Label>
      <Label value="Other"></Label>
    </Labels>
    <Header value="Listen the audio:"></Header>
    <Audio name="audio" value="$url"></Audio>
  </View>
`;

export const audioDecoderErrorData = {
  url: "/public/files/video.mp4", // mp4 is not supported by audio decoder
};

export const audioHttpErrorData = {
  url: "/files/doesnt_exist.mp3",
};

export const audioErrorsAnnotations = [
  {
    from_name: "choice",
    id: "hIj6zg57SY",
    to_name: "audio",
    type: "choices",
    origin: "manual",
    value: {
      choices: ["Lo-Fi"],
    },
  },
  {
    from_name: "label",
    id: "JhxupEJWlW",
    to_name: "audio",
    original_length: 98.719925,
    type: "labels",
    origin: "manual",
    value: {
      channel: 1,
      end: 59.39854733358493,
      labels: ["Other"],
      start: 55.747572792986325,
    },
  },
];
