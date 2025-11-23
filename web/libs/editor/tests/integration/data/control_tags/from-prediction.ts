export const allClassificationsConfig = `<View>
    <Text name="text" value="$text"></Text>
    <Choices name="choices" toName="text" fromPrediction="true">
        <Choice value="Choice 1" />
        <Choice value="Choice 2" />
    </Choices>
    <DateTime name="datetime" toName="text"/>
    <Number name="number" toName="text"/>
    <Rating name="rating" toName="text"/>
    <TextArea name="textarea" toName="text"/>
    <TextArea name="textarea_edit" toName="text" editable="true" />
</View>`;

export const textData = {
  text: "This text exists for no reason",
};

export const prediction = {
  id: "223322223322",
  result: [
    {
      id: "1",
      from_name: "choices",
      to_name: "text",
      type: "choices",
      value: {
        choices: ["Choice 1"],
      },
    },
    {
      id: "2",
      from_name: "datetime",
      to_name: "text",
      type: "datetime",
      value: {
        datetime: "2000-01-01T00:00:00.000Z",
      },
    },
    {
      id: "3",
      from_name: "number",
      to_name: "text",
      type: "number",
      value: {
        number: 3.14,
      },
    },
    {
      id: "4",
      from_name: "rating",
      to_name: "text",
      type: "rating",
      value: {
        rating: 3,
      },
    },
    {
      id: "5",
      from_name: "textarea",
      to_name: "text",
      type: "textarea",
      value: {
        text: ["This is a text"],
      },
    },
    {
      id: "5",
      from_name: "textarea_edit",
      to_name: "text",
      type: "textarea",
      value: {
        text: ["This text will be"],
      },
    },
  ],
};
