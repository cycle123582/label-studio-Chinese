export const textWithDualTaxonomyConfig = `<View>
  <Text name="text" value="$text"/>
  <Taxonomy name="category" toName="text" labeling="true">
    <Choice value="Person"/>
    <Choice value="Organization"/>
    <Choice value="Location"/>
    <Choice value="Event"/>
  </Taxonomy>
  <Taxonomy name="sentiment" toName="text" labeling="true">
    <Choice value="Positive"/>
    <Choice value="Negative"/>
    <Choice value="Neutral"/>
  </Taxonomy>
</View>`;

export const simpleTextData = {
  text: "Apple Inc. is a technology company headquartered in Cupertino, California. The company was founded by Steve Jobs in 1976.",
};

export const expectedResult = [
  {
    id: "taxonomy_category_1",
    type: "taxonomy",
    value: {
      taxonomy: [["Organization"]],
    },
    origin: "manual",
    to_name: "text",
    from_name: "category",
  },
  {
    id: "taxonomy_sentiment_1",
    type: "taxonomy",
    value: {
      taxonomy: [["Positive"]],
    },
    origin: "manual",
    to_name: "text",
    from_name: "sentiment",
  },
];
