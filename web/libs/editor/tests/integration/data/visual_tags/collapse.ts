export const simpleData = {
  text: "This is sample text for testing",
};

// Basic Collapse with default settings
export const basicCollapseConfig = `
<View>
  <Collapse>
    <Panel value="Panel 1">
      <Text name="text1" value="Content for panel 1" />
    </Panel>
    <Panel value="Panel 2">
      <Text name="text2" value="Content for panel 2" />
    </Panel>
    <Panel value="Panel 3">
      <Text name="text3" value="Content for panel 3" />
    </Panel>
  </Collapse>
</View>
`;

// Collapse with accordion=false (multiple panels can be open)
export const nonAccordionCollapseConfig = `
<View>
  <Collapse accordion="false">
    <Panel value="Panel 1">
      <Text name="text1" value="Content for panel 1" />
    </Panel>
    <Panel value="Panel 2">
      <Text name="text2" value="Content for panel 2" />
    </Panel>
    <Panel value="Panel 3">
      <Text name="text3" value="Content for panel 3" />
    </Panel>
  </Collapse>
</View>
`;

// Collapse with bordered=true
export const borderedCollapseConfig = `
<View>
  <Collapse bordered="true">
    <Panel value="Panel 1">
      <Text name="text1" value="Content for panel 1" />
    </Panel>
    <Panel value="Panel 2">
      <Text name="text2" value="Content for panel 2" />
    </Panel>
    <Panel value="Panel 3">
      <Text name="text3" value="Content for panel 3" />
    </Panel>
  </Collapse>
</View>
`;

// Collapse with global open=true (all panels open by default)
export const globalOpenCollapseConfig = `
<View>
  <Collapse open="true" accordion="false">
    <Panel value="Panel 1">
      <Text name="text1" value="Content for panel 1" />
    </Panel>
    <Panel value="Panel 2">
      <Text name="text2" value="Content for panel 2" />
    </Panel>
    <Panel value="Panel 3">
      <Text name="text3" value="Content for panel 3" />
    </Panel>
  </Collapse>
</View>
`;

// Collapse with mixed panel-level open states
export const mixedOpenCollapseConfig = `
<View>
  <Collapse open="false" accordion="false">
    <Panel value="Panel 1" open="true">
      <Text name="text1" value="Content for panel 1" />
    </Panel>
    <Panel value="Panel 2" open="false">
      <Text name="text2" value="Content for panel 2" />
    </Panel>
    <Panel value="Panel 3" open="true">
      <Text name="text3" value="Content for panel 3" />
    </Panel>
  </Collapse>
</View>
`;

// Collapse with global open=true but some panels override to closed
export const globalOpenWithOverridesConfig = `
<View>
  <Collapse open="true" accordion="false">
    <Panel value="Panel 1" open="false">
      <Text name="text1" value="Content for panel 1" />
    </Panel>
    <Panel value="Panel 2">
      <Text name="text2" value="Content for panel 2" />
    </Panel>
    <Panel value="Panel 3" open="false">
      <Text name="text3" value="Content for panel 3" />
    </Panel>
  </Collapse>
</View>
`;

// Collapse with all parameters combined
export const allParamsCollapseConfig = `
<View>
  <Collapse accordion="false" bordered="true" open="true">
    <Panel value="Panel 1" open="false">
      <Text name="text1" value="Content for panel 1" />
    </Panel>
    <Panel value="Panel 2">
      <Text name="text2" value="Content for panel 2" />
    </Panel>
    <Panel value="Panel 3" open="false">
      <Text name="text3" value="Content for panel 3" />
    </Panel>
  </Collapse>
</View>
`;
