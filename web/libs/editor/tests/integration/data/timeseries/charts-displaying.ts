// Test data for TimeSeries interactive behavior and boundary validation
// Tests navigation, zoom operations and ensures charts stay within visible bounds

// Configuration for TimeSeries with MultiChannel
export const multiChannelConfig = `
<View>
  <Header value="TimeSeries Interactive Navigation Testing"/>
  <TimeSeriesLabels name="label" toName="ts">
    <Label value="High" background="red"/>
    <Label value="Low" background="blue"/>
    <Label value="Normal" background="green"/>
  </TimeSeriesLabels>
  <TimeSeries name="ts" value="$timeseries" valueType="json" timeColumn="time" overviewChannels="ascending">
    <MultiChannel height="300">
      <Channel column="ascending"
               units="units"
               displayFormat=",.1f"
               legend="Ascending Trend"
               strokeColor="#1f77b4"/>
      <Channel column="descending"
               units="units"
               displayFormat=",.1f"
               legend="Descending Trend"
               strokeColor="#ff7f0e"/>
      <Channel column="high_variance"
               units="units"
               displayFormat=",.1f"
               legend="High Variance"
               strokeColor="#2ca02c"/>
    </MultiChannel>
  </TimeSeries>
</View>
`;

// Configuration for single channel TimeSeries
export const singleChannelConfig = `
<View>
  <Header value="TimeSeries Single Channel Navigation Testing"/>
  <TimeSeriesLabels name="label" toName="ts">
    <Label value="Peak" background="red"/>
    <Label value="Valley" background="blue"/>
  </TimeSeriesLabels>
  <TimeSeries name="ts" value="$timeseries" valueType="json" timeColumn="time" overviewChannels="ascending">
    <Channel column="ascending"
             units="units"
             displayFormat=",.1f"
             legend="Ascending Data"
             strokeColor="#1f77b4"/>
  </TimeSeries>
</View>
`;

// Generate test data with varied patterns for navigation testing
function generateNavigationTestData(pointCount = 200000) {
  const data = {
    time: [] as number[],
    ascending: [] as number[],
    descending: [] as number[],
    high_variance: [] as number[],
  };

  const timeStep = 1;

  for (let i = 0; i < pointCount; i++) {
    const t = i * timeStep;
    data.time.push(t);

    // Ascending trend with moderate values (0 to 1000)
    data.ascending.push(i * (1000 / pointCount) + Math.sin(t * 0.01) * 50);

    // Descending trend with moderate negative values (0 to -800)
    data.descending.push(-i * (800 / pointCount) + Math.cos(t * 0.008) * 40);

    // High variance data oscillating between -500 and 500
    data.high_variance.push(
      500 * Math.sin(t * 0.02) + 200 * Math.cos(t * 0.05) + 100 * Math.sin(t * 0.1) * Math.random(),
    );
  }

  return data;
}

// Heavy dataset for displacement testing (200K points) - wrapped in proper format for LabelStudio
export const heavyDatasetForDisplacement = {
  timeseries: generateNavigationTestData(200000),
};
