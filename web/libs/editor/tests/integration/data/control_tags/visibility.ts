export const simpleVisibleWhenVisibilityConfig = `<View>
  <Text name="text" value="$text"/>

  <View name="Level 1">
    <Header value="Level 1"/>
    <Choices name="level1" toName="text" choice="single" showInLine="true">
      <Choice value="1A"/>
      <Choice value="1B"/>
    </Choices>
  </View>

  <Choices
    name="level2" toName="text" choice="single" showInLine="true"
    visibleWhen="choice-selected"
    whenTagName="level1"
    whenChoiceValue="1A"
  >
    <Choice value="2A"/>
    <Choice value="2B"/>
  </Choices>

  <Choices
    name="level3" toName="text" choice="single" showInLine="true"
    visibleWhen="choice-selected"
    whenTagName="level2"
    whenChoiceValue="2A"
  >
    <Choice value="3A"/>
    <Choice value="3B"/>
  </Choices>
</View>`;

export const multipleChainedViewsVisibilityConfig = `<View>
  <Text name="text" value="$text"/>

  <View name="Level 1">
    <Header value="Level 1"/>
    <Choices name="level1" toName="text" choice="single" showInLine="true">
      <Choice value="1A"/>
      <Choice value="1B"/>
    </Choices>
  </View>

  <!-- Level 2 -->
  <View
    name="Level 2"
    visibleWhen="choice-selected"
    whenTagName="level1"
    whenChoiceValue="1A"
  >
    <Header value="Level 2"/>
    <Choices name="level2" toName="text" choice="single" showInLine="true">
      <Choice value="2A"/>
      <Choice value="2B"/>
    </Choices>
  </View>

  <!-- Level 3A -->
  <View
    name="Level 3A"
    visibleWhen="choice-selected"
    whenTagName="level2"
    whenChoiceValue="2A"
  >
    <Header value="Level 3A"/>
    <Choices name="level3A" toName="text" choice="single" showInLine="true">
      <Choice value="3X"/>
      <Choice value="3Y"/>
    </Choices>
  </View>

  <!-- Level 3B -->
  <View
    name="Level 3B"
    visibleWhen="choice-selected"
    whenTagName="level2"
    whenChoiceValue="2B"
  >
    <Header value="Level 3B"/>
    <Choices name="level3B" toName="text" choice="single" showInLine="true">
      <Choice value="3Q"/>
      <Choice value="3W"/>
    </Choices>
  </View>
</View>`;

export const simpleUnselectedVisibilityConfig = `
  <View>
    <Text name="text" value="$text"/>

    <Choices name="level1" toName="text" choice="single-radio" showInline="true" required="true">
      <Choice value="A" />
      <Choice value="B" />
      <Choice value="Other" />
    </Choices>
    <View name="level2" visibleWhen="choice-selected" whenTagName="level1" whenChoiceValue="A,B">
      <Header value="Selected level"/>
      <Choices name="selected-level" toName="text">
        <Choice value="1X"/>
      </Choices>
    </View>
    <View name="level3" visibleWhen="choice-unselected" whenChoiceValue="Other" whenTagName="level1">
      <Header value="Unselected level"/>
      <Choices name="unselected-level" toName="text">
        <Choice value="2X"/>
      </Choices>
    </View>
  </View>
`;

export const textareaVisibilityConfig = `
  <View>
    <Header value="Author"/>
    <Text name="text" value="$text"/>
    <Choices name="author" toName="text" required="false" maxUsages="1">
      <Choice value="choice1"/>
    </Choices>

    <View visibleWhen="choice-selected" whenTagName="author" whenChoiceValue="choice1">
      <Header value="New Author"/>
      <TextArea name="new_author" toName="text" maxSubmissions="1"/>
    </View>
  </View>
`;

export const perRegionVisibilityConfig = `
  <View>
    <Image name="image" value="$image"/>

    <RectangleLabels name="label" toName="image">
      <Label value="Tumor" background="green"/>
    </RectangleLabels>

    <Choices name="classification" toName="image" perRegion="true">
      <Choice value="Benign"/>
      <Choice value="Malignant"/>
      <Choice value="Normal"/>
    </Choices>
  </View>
`;

export const perRegionVisibilityResult = [
  {
    id: "Dx_aB91ISN",
    source: "$image",
    from_name: "label",
    to_name: "image",
    type: "rectanglelabels",
    origin: "manual",
    value: {
      height: 20,
      rotation: 0,
      width: 20,
      x: 40,
      y: 40,
      rectanglelabels: ["Tumor"],
    },
  },
];

export const perRegionConditionalVisibilityConfig = `
  <View>
    <Image name="image" value="$image"/>
    <Rectangle name="rect" toName="image" />
    <View visibleWhen="region-selected">

    <!-- Level 1 -->
      <View name="Level 1">
        <Header value="Level 1"/>
        <Choices perRegion="true" name="level1" toName="image" choice="single" showInLine="true">
          <Choice value="Start nesting choices"/>
          <Choice value="Show nothing"/>
        </Choices>
      </View>

      <!-- Level 2 under Safety and Compliance -->
      <View name="Level 2 Safety and Compliance"
            visibleWhen="choice-selected"
            whenTagName="level1"
            whenChoiceValue="Start nesting choices">
        <Header value="Level 2"/>
        <Choices perRegion="true" name="level2_safety" toName="image" choice="single" showInLine="true"
                visibleWhen="choice-selected"
            whenTagName="level1"
            whenChoiceValue="Start nesting choices">
          <Choice value="A"/>
          <Choice value="B"/>
        </Choices>
      </View>
      <!-- Level 3 under Documentation and Record Keeping -->
      <View name="Level 3 Doc and Record"
            visibleWhen="choice-selected"
            whenTagName="level2_safety"
            whenChoiceValue="A">
        <Header value="Level 3"/>
        <Choices perRegion="true" name="level3_doc" toName="image" choice="single" showInLine="true"
                visibleWhen="choice-selected"
            whenTagName="level2_safety"
            whenChoiceValue="A">
          <Choice value="X"/>
          <Choice value="Y"/>
        </Choices>
      </View>
      <!-- Level 3 under Training and Familiarization (under Safety and Compliance) -->
      <View name="Level 3 Training"
            visibleWhen="choice-selected"
            whenTagName="level2_safety"
            whenChoiceValue="B">
        <Header value="Level 3"/>
        <Choices perRegion="true" name="level3_training" toName="image" choice="single" showInLine="true">
          <Choice value="Q"/>
          <Choice value="W"/>
        </Choices>
      </View>
    </View>
  </View>
`;

export const perRegionConditionalVisibilityResult = [
  {
    original_width: 600,
    original_height: 403,
    image_rotation: 0,
    value: {
      x: 22.72106824925816,
      y: 47.18100890207715,
      width: 21.126607319485665,
      height: 31.157270029673583,
      rotation: 0,
    },
    id: "fgWSL6Nor_",
    from_name: "rect",
    to_name: "image",
    type: "rectangle",
    origin: "manual",
  },
];

export const visibilityTextData = {
  text: "This text exists for no reason",
};

export const visibilityImageData = {
  image: "https://data.heartex.net/open-images/train_0/mini/00155094b7acc33b.jpg",
};
