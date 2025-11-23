export const dataSimple = {
  text: "This text exists for testing purposes",
};

export const configSimple = `<View>
  <Labels name="lbl" toName="text">
    <Label value="Word1" />
    <Label value="Word2" />
  </Labels>
  <Text name="text" value="$text" inline="true"/>
</View>`;

export const resultSimple = {
  id: "reg1",
  type: "labels",
  from_name: "lbl",
  to_name: "text",
  score: 0.89,
  value: {
    start: 5,
    end: 9,
    labels: ["Word1"],
    text: "text",
  },
};
