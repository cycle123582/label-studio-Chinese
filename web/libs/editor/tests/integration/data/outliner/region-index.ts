export const simpleConfig = `<View>
    <Text name="text" value="$text" />
    <Labels name="label" toName="text">
        <Label value="Label 1" />
        <Label value="Label 2" />
        <Label value="Label 3" />
    </Labels>
</View>`;

export const simpleData = {
  text: "It is just a simple text for testing.",
};

export const resultWithRelations = [
  {
    value: {
      start: 6,
      end: 10,
      text: "just",
      labels: ["Label 1"],
    },
    id: "ioyKUe3_0j",
    from_name: "label",
    to_name: "text",
    type: "labels",
    origin: "manual",
  },
  {
    value: {
      start: 13,
      end: 19,
      text: "simple",
      labels: ["Label 2"],
    },
    id: "_PKljfdlff",
    from_name: "label",
    to_name: "text",
    type: "labels",
    origin: "manual",
  },
  {
    value: {
      start: 29,
      end: 36,
      text: "testing",
      labels: ["Label 3"],
    },
    id: "6_7hMzDv9H",
    from_name: "label",
    to_name: "text",
    type: "labels",
    origin: "manual",
  },
  {
    from_id: "ioyKUe3_0j",
    to_id: "6_7hMzDv9H",
    type: "relation",
    direction: "right",
  },
];

export const panelState = {
  panelData: {
    "info-history": {
      order: 1,
      top: 0,
      left: 0,
      relativeLeft: 0,
      relativeTop: 0,
      zIndex: 10,
      width: 320,
      height: 385,
      visible: true,
      detached: false,
      alignment: "right",
      maxHeight: 500,
      panelViews: [
        {
          name: "info",
          title: "Info",
          component: { isMobxInjector: true, wrappedComponent: { compare: null } },
          active: true,
        },
        {
          name: "history",
          title: "History",
          component: { isMobxInjector: true, wrappedComponent: { compare: null } },
          active: false,
        },
      ],
    },
    "regions-relations": {
      order: 2,
      top: 385,
      left: 0,
      relativeLeft: 0,
      relativeTop: 0,
      zIndex: 10,
      width: 320,
      height: 385,
      visible: true,
      detached: false,
      alignment: "right",
      maxHeight: 500,
      panelViews: [
        { name: "regions", title: "Regions", component: { compare: null }, active: false },
        {
          name: "relations",
          title: "Relations",
          component: { isMobxInjector: true, wrappedComponent: { compare: null } },
          active: true,
        },
      ],
    },
  },
  collapsedSide: { left: false, right: false },
};

export const labelStudio_settings = {
  enableHotkeys: true,
  enablePanelHotkeys: true,
  enableTooltips: true,
  enableLabelTooltips: true,
  continuousLabeling: false,
  selectAfterCreate: false,
  fullscreen: false,
  bottomSidePanel: false,
  sidePanelMode: "SIDEPANEL_MODE_REGIONS",
  imageFullSize: false,
  enableAutoSave: false,
  showLabels: true,
  showLineNumbers: false,
  showAnnotationsPanel: true,
  showPredictionsPanel: true,
  preserveSelectedTool: true,
  enableSmoothing: true,
  videoHopSize: 10,
  isDestroying: false,
};
