export const timelineVideoData = { video: "/public/files/opossum_intro.webm" };

export const timelineVideoConfig = `<View>
  <Video name="video" value="$video" />
  <TimelineLabels name="timeline" toName="video">
    <Label value="Movement" background="#98C84E" hotkey="1"/>
    <Label value="Nothing" background="#944BFF" hotkey="2"/>
  </TimelineLabels>
</View>`;

// Single timeline region (frames 5-15)
export const singleTimelineRegionResult = [
  {
    value: {
      ranges: [{ start: 5, end: 15 }],
      timelinelabels: ["Movement"],
    },
    id: "timeline_region_1",
    from_name: "timeline",
    to_name: "video",
    type: "timeserieslabels",
    origin: "manual",
  },
];

// Multiple timeline regions (frames 5-10 and 15-20)
export const multipleTimelineRegionsResult = [
  {
    value: {
      ranges: [{ start: 5, end: 10 }],
      timelinelabels: ["Movement"],
    },
    id: "timeline_region_1",
    from_name: "timeline",
    to_name: "video",
    type: "timeserieslabels",
    origin: "manual",
  },
  {
    value: {
      ranges: [{ start: 15, end: 20 }],
      timelinelabels: ["Nothing"],
    },
    id: "timeline_region_2",
    from_name: "timeline",
    to_name: "video",
    type: "timeserieslabels",
    origin: "manual",
  },
];

export const multipleTimelineRegionsLongResult = [
  {
    value: {
      ranges: [{ start: 5, end: 10 }],
      timelinelabels: ["Movement"],
    },
    id: "timeline_region_1",
    from_name: "timeline",
    to_name: "video",
    type: "timeserieslabels",
    origin: "manual",
  },
  {
    value: {
      ranges: [{ start: 15, end: 50 }],
      timelinelabels: ["Nothing"],
    },
    id: "timeline_region_2",
    from_name: "timeline",
    to_name: "video",
    type: "timeserieslabels",
    origin: "manual",
  },
];

// Overlapping timeline regions (frames 8-12 and 10-18)
export const overlappingTimelineRegionsResult = [
  {
    value: {
      ranges: [{ start: 8, end: 12 }],
      timelinelabels: ["Movement"],
    },
    id: "timeline_region_1",
    from_name: "timeline",
    to_name: "video",
    type: "timeserieslabels",
    origin: "manual",
  },
  {
    value: {
      ranges: [{ start: 10, end: 18 }],
      timelinelabels: ["Nothing"],
    },
    id: "timeline_region_2",
    from_name: "timeline",
    to_name: "video",
    type: "timeserieslabels",
    origin: "manual",
  },
];
