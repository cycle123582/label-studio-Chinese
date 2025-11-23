Feature("Table");

const config = `
<View>
    <Header value="Table with {key: value} pairs"/>
    <Table name="table" value="$text"/>
    <Choices name="choice" toName="table">
        <Choice value="Correct"/>
        <Choice value="Incorrect"/>
    </Choices>
</View>
`;

const data = {
  text: {
    cTest: 2,
    aaTest: 1,
    bbbTest: 3,
    ATest: 4,
  },
};

const params = { annotations: [{ id: "test", result: [] }], config, data };

Scenario("Check if the table is sorted", async ({ I, LabelStudio, AtTableView }) => {
  const _sortedArr = ["aaTest", "ATest", "bbbTest", "cTest"];

  I.amOnPage("/");

  LabelStudio.init(params);

  await AtTableView.seeKeys(_sortedArr);
});

Scenario("Render JSON array of objects with derived columns", async ({ I, LabelStudio }) => {
  const listConfig = `
<View>
    <Header value="Table from list of objects"/>
    <Table name="table" value="$rows"/>
    <Choices name="choice" toName="table">
        <Choice value="Correct"/>
        <Choice value="Incorrect"/>
    </Choices>
</View>
`;

  const listData = {
    rows: [
      { a: 1, b: 2 },
      { a: 3, b: 4, c: 5 },
    ],
  };

  const params = { annotations: [{ id: "test", result: [] }], config: listConfig, data: listData };

  I.amOnPage("/");
  LabelStudio.init(params);
  LabelStudio.waitForObjectsReady();

  I.see("a");
  I.see("b");
  I.see("c");
  I.dontSee("Name");
  I.dontSee("Value");

  I.see("1");
  I.see("2");
  I.see("3");
  I.see("4");
  I.see("5");
});

Scenario("Render JSON array of primitives as key/value table", async ({ I, LabelStudio }) => {
  const listKVConfig = `
<View>
    <Header value="Table from list of primitives"/>
    <Table name="table" value="$items"/>
    <Choices name="choice" toName="table">
        <Choice value="Correct"/>
        <Choice value="Incorrect"/>
    </Choices>
</View>
`;

  const listKVData = {
    items: ["alpha", 123, { nested: true }],
  };

  const params = { annotations: [{ id: "test", result: [] }], config: listKVConfig, data: listKVData };

  I.amOnPage("/");
  LabelStudio.init(params);
  LabelStudio.waitForObjectsReady();

  I.see("Name");
  I.see("Value");

  I.see("0");
  I.see("alpha");
  I.see("1");
  I.see("123");
  I.see("2");
  I.see(JSON.stringify({ nested: true }));
});
