// language=HTML
export const configAllTags = `
  <View>
    <Style>
      .in-config-block {
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 24px;
      }

      .in-config-block h4 {
        font-size: 28px;
      }

      .in-config-block h4:nth-child(n+2) {
        font-size: 20px;
      }

      .in-config-block .in-config-block h4 {
        font-size: 18px;
        color: #666 !important;
      }
    </Style>
    <!-- Audio -->
    <View className="in-config-block">
      <Header>Audio:</Header>
      <Audio name="audio" value="$audio"/>
      <Labels name="audio-label" toName="audio" value="$dynamicLabels">
        <Label value="Audio Label 1"/>
        <Label value="Audio Label 2"/>
      </Labels>
      <!-- Audio Per-region classifications -->
      <View visibleWhen="region-selected" whenTagName="audio-label">
        <Header>Per-region classification:</Header>
        <View className="in-config-block">
          <Header>Per-region Choices:</Header>
          <Choices name="audio-choices-per-region" toName="audio" value="$dynamicChoices" perRegion="true">
            <Choice value="Audio Per-Region Choice 1"/>
            <Choice value="Audio Per-Region Choice 2"/>
          </Choices>
          <Header>Per-region DateTime:</Header>
          <DateTime name="audio-date-per-region" toName="audio" perRegion="true"/>
          <Header>Per-region Number:</Header>
          <Number name="audio-number-per-region" toName="audio" perRegion="true"/>
          <Header>Per-region TextArea:</Header>
          <TextArea name="audio-text-per-region" toName="audio" perRegion="true"/>
          <Header>Per-region Taxonomy:</Header>
          <Taxonomy name="audio-taxonomy-per-region" toName="audio" value="$dynamicTaxonomy" perRegion="true">
            <Choice value="Audio Per-Region Taxonomy Choice 1"/>
            <Choice value="Audio Per-Region Taxonomy Choice 2"/>
          </Taxonomy>
        </View>
      </View>
      <!-- Audio Global classifications -->
      <Header>Global classifications:</Header>
      <View className="in-config-block">
        <Header>Choices:</Header>
        <Choices name="audio-choices" toName="audio" value="$dynamicChoices">
          <Choice value="Audio Choice 1"/>
          <Choice value="Audio Choice 2"/>
        </Choices>
        <Header>DateTime:</Header>
        <DateTime name="audio-date" toName="audio"/>
        <Header>Number:</Header>
        <Number name="audio-number" toName="audio"/>
        <Header>TextArea:</Header>
        <TextArea name="audio-text" toName="audio"/>
        <Header>Taxonomy:</Header>
        <Taxonomy name="audio-taxonomy" toName="audio" value="$dynamicTaxonomy">
          <Choice value="Audio Taxonomy Choice 1"/>
          <Choice value="Audio Taxonomy Choice 2"/>
        </Taxonomy>
      </View>
    </View>
    <!-- Image -->
    <View className="in-config-block">
      <Header>Image:</Header>
      <Image name="image" value="$image"/>
      <Brush name="brush" toName="image"/>
      <BrushLabels name="brush-label" toName="image">
        <Label value="Brush Label 1"/>
      </BrushLabels>
      <Ellipse name="ellipse" toName="image"/>
      <EllipseLabels name="ellipse-label" toName="image">
        <Label value="Ellipse Label 1"/>
      </EllipseLabels>
      <KeyPoint name="keypoint" toName="image"/>
      <KeyPointLabels name="keypoint-label" toName="image">
        <Label value="KeyPoint Label 1"/>
      </KeyPointLabels>
      <MagicWand name="magicwand" toName="image"/>
      <Polygon name="polygon" toName="image"/>
      <PolygonLabels name="polygon-label" toName="image">
        <Label value="Polygon Label 1"/>
      </PolygonLabels>
      <Rectangle name="rectangle" toName="image"/>
      <RectangleLabels name="rectangle-label" toName="image" value="$dynamicLabels">
        <Label value="Rectangle Label 1"/>
      </RectangleLabels>

      <!-- Image Per-region classifications -->
      <View visibleWhen="region-selected" whenTagName="rectangle-label">
        <Header>Per-region classification:</Header>
        <View className="in-config-block">
          <Header>Per-region Choices:</Header>
          <Choices name="image-choices-per-region" toName="image" value="$dynamicChoices" perRegion="true">
            <Choice value="Image Per-Region Choice 1"/>
            <Choice value="Image Per-Region Choice 2"/>
          </Choices>
          <Header>Per-region DateTime:</Header>
          <DateTime name="image-date-per-region" toName="image" perRegion="true"/>
          <Header>Per-region Number:</Header>
          <Number name="image-number-per-region" toName="image" perRegion="true"/>
          <Header>Per-region TextArea:</Header>
          <TextArea name="image-text-per-region" toName="image" perRegion="true"/>
          <Header>Per-region Taxonomy:</Header>
          <Taxonomy name="image-taxonomy-per-region" toName="image" value="$dynamicTaxonomy" perRegion="true">
            <Choice value="Image Per-Region Taxonomy Choice 1"/>
            <Choice value="Image Per-Region Taxonomy Choice 2"/>
          </Taxonomy>
        </View>
      </View>
      <!-- Image Global classifications -->
      <Header>Global classifications:</Header>
      <View className="in-config-block">
        <Header>Choices:</Header>
        <Choices name="image-choices" toName="image" value="$dynamicChoices">
          <Choice value="Image Choice 1"/>
          <Choice value="Image Choice 2"/>
        </Choices>
        <Header>DateTime:</Header>
        <DateTime name="image-date" toName="image"/>
        <Header>Number:</Header>
        <Number name="image-number" toName="image"/>
        <Header>TextArea:</Header>
        <TextArea name="image-text" toName="image"/>
        <Header>Taxonomy:</Header>
        <Taxonomy name="image-taxonomy" toName="image" value="$dynamicTaxonomy">
          <Choice value="Image Taxonomy Choice 1"/>
          <Choice value="Image Taxonomy Choice 2"/>
        </Taxonomy>
      </View>
    </View>
    <!-- MIG -->
    <View className="in-config-block">
      <Header>MIG:</Header>
      <Image name="mig" valueList="$mig"/>
      <Brush name="mig-brush" toName="mig"/>
      <BrushLabels name="mig-brush-label" toName="mig">
        <Label value="Brush Label 1"/>
      </BrushLabels>
      <Ellipse name="mig-ellipse" toName="mig"/>
      <EllipseLabels name="mig-ellipse-label" toName="mig">
        <Label value="Ellipse Label 1"/>
      </EllipseLabels>
      <KeyPoint name="mig-keypoint" toName="mig"/>
      <KeyPointLabels name="mig-keypoint-label" toName="mig">
        <Label value="KeyPoint Label 1"/>
      </KeyPointLabels>
      <MagicWand name="mig-magicwand" toName="mig"/>
      <Polygon name="mig-polygon" toName="mig"/>
      <PolygonLabels name="mig-polygon-label" toName="mig">
        <Label value="Polygon Label 1"/>
      </PolygonLabels>
      <Rectangle name="mig-rectangle" toName="mig"/>
      <RectangleLabels name="mig-rectangle-label" toName="mig" value="$dynamicLabels">
        <Label value="Rectangle Label 1"/>
      </RectangleLabels>

      <!-- MIG Per-region classifications -->
      <View visibleWhen="region-selected" whenTagName="mig-rectangle-label">
        <Header>Per-region classification:</Header>
        <View className="in-config-block">
          <Header>Per-region Choices:</Header>
          <Choices name="mig-choices-per-region" toName="mig" value="$dynamicChoices" perRegion="true">
            <Choice value="MIG Per-Region Choice 1"/>
            <Choice value="MIG Per-Region Choice 2"/>
          </Choices>
          <Header>Per-region DateTime:</Header>
          <DateTime name="mig-date-per-region" toName="mig" perRegion="true"/>
          <Header>Per-region Number:</Header>
          <Number name="mig-number-per-region" toName="mig" perRegion="true"/>
          <Header>Per-region TextArea:</Header>
          <TextArea name="mig-text-per-region" toName="mig" perRegion="true"/>
          <Header>Per-region Taxonomy:</Header>
          <Taxonomy name="mig-taxonomy-per-region" toName="mig" value="$dynamicTaxonomy" perRegion="true">
            <Choice value="MIG Per-Region Taxonomy Choice 1"/>
            <Choice value="MIG Per-Region Taxonomy Choice 2"/>
          </Taxonomy>
        </View>
      </View>
      <!-- MIG Per-Item classifications -->
      <View>
        <Header>Per-Item classification:</Header>
        <View className="in-config-block">
          <Header>Per-Item Choices:</Header>
          <Choices name="mig-choices-per-item" toName="mig" value="$dynamicChoices" perItem="true">
            <Choice value="MIG Per-Item Choice 1"/>
            <Choice value="MIG Per-Item Choice 2"/>
          </Choices>
          <Header>Per-Item DateTime:</Header>
          <DateTime name="mig-date-per-item" toName="mig" perItem="true"/>
          <Header>Per-Item Number:</Header>
          <Number name="mig-number-per-item" toName="mig" perItem="true"/>
          <Header>Per-Item TextArea:</Header>
          <TextArea name="mig-text-per-item" toName="mig" perItem="true"/>
          <Header>Per-Item Taxonomy:</Header>
          <Taxonomy name="mig-taxonomy-per-item" toName="mig" value="$dynamicTaxonomy" perItem="true">
            <Choice value="MIG Per-Item Taxonomy Choice 1"/>
            <Choice value="MIG Per-Item Taxonomy Choice 2"/>
          </Taxonomy>
        </View>
      </View>
      <!-- MIG Global classifications -->
      <Header>Global classifications:</Header>
      <View className="in-config-block">
        <Header>Choices:</Header>
        <Choices name="mig-choices" toName="mig" value="$dynamicChoices">
          <Choice value="MIG Choice 1"/>
          <Choice value="MIG Choice 2"/>
        </Choices>
        <Header>DateTime:</Header>
        <DateTime name="mig-date" toName="mig"/>
        <Header>Number:</Header>
        <Number name="mig-number" toName="mig"/>
        <Header>TextArea:</Header>
        <TextArea name="mig-text" toName="mig"/>
        <Header>Taxonomy:</Header>
        <Taxonomy name="mig-taxonomy" toName="mig" value="$dynamicTaxonomy">
          <Choice value="MIG Taxonomy Choice 1"/>
          <Choice value="MIG Taxonomy Choice 2"/>
        </Taxonomy>
      </View>
    </View>
    <!-- Paragraphs -->
    <View className="in-config-block">
      <Header>Paragraphs:</Header>
      <Paragraphs name="paragraphs" value="$paragraphs"/>
      <ParagraphLabels name="paragraphlabels" toName="paragraphs" value="$dynamicLabels">
        <Label value="Paragraphs Label 1"/>
        <Label value="Paragraphs Label 2"/>
      </ParagraphLabels>
      <!-- Paragraphs Per-region classifications -->
      <View visibleWhen="region-selected" whenTagName="paragraphlabels">
        <Header>Per-region classification:</Header>
        <View className="in-config-block">
          <Header>Per-region Choices:</Header>
          <Choices name="paragraphs-choices-per-region" toName="paragraphs" value="$dynamicChoices" perRegion="true">
            <Choice value="Paragraphs Per-Region Choice 1"/>
            <Choice value="Paragraphs Per-Region Choice 2"/>
          </Choices>
          <Header>Per-region DateTime:</Header>
          <DateTime name="paragraphs-date-per-region" toName="paragraphs" perRegion="true"/>
          <Header>Per-region Number:</Header>
          <Number name="paragraphs-number-per-region" toName="paragraphs" perRegion="true"/>
          <Header>Per-region TextArea:</Header>
          <TextArea name="paragraphs-text-per-region" toName="paragraphs" perRegion="true"/>
          <Header>Per-region Taxonomy:</Header>
          <Taxonomy name="paragraphs-taxonomy-per-region" toName="paragraphs" value="$dynamicTaxonomy" perRegion="true">
            <Choice value="Paragraphs Per-Region Taxonomy Choice 1"/>
            <Choice value="Paragraphs Per-Region Taxonomy Choice 2"/>
          </Taxonomy>
        </View>
      </View>
      <!-- Paragraphs Global classifications -->
      <Header>Global classifications:</Header>
      <View className="in-config-block">
        <Header>Choices:</Header>
        <Choices name="paragraphs-choices" toName="paragraphs" value="$dynamicChoices">
          <Choice value="Paragraphs Choice 1"/>
          <Choice value="Paragraphs Choice 2"/>
        </Choices>
        <Header>DateTime:</Header>
        <DateTime name="paragraphs-date" toName="paragraphs"/>
        <Header>Number:</Header>
        <Number name="paragraphs-number" toName="paragraphs"/>
        <Header>TextArea:</Header>
        <TextArea name="paragraphs-text" toName="paragraphs"/>
        <Header>Taxonomy:</Header>
        <Taxonomy name="paragraphs-taxonomy" toName="paragraphs" value="$dynamicTaxonomy">
          <Choice value="Paragraphs Taxonomy Choice 1"/>
          <Choice value="Paragraphs Taxonomy Choice 2"/>
        </Taxonomy>
      </View>
    </View>
    <!-- Text -->
    <View className="in-config-block">
      <Header>Text:</Header>
      <Text name="text" value="$text"/>
      <Labels name="text-labels" toName="text" value="$dynamicLabels">
        <Label value="Text Label 1"/>
        <Label value="Text Label 2"/>
      </Labels>
      <!-- Text Per-region classifications -->
      <View visibleWhen="region-selected" whenTagName="text-labels">
        <Header>Per-region classification:</Header>
        <View className="in-config-block">
          <Header>Per-region Choices:</Header>
          <Choices name="text-choices-per-region" toName="text" value="$dynamicChoices" perRegion="true">
            <Choice value="Text Per-Region Choice 1"/>
            <Choice value="Text Per-Region Choice 2"/>
          </Choices>
          <Header>Per-region DateTime:</Header>
          <DateTime name="text-date-per-region" toName="text" perRegion="true"/>
          <Header>Per-region Number:</Header>
          <Number name="text-number-per-region" toName="text" perRegion="true"/>
          <Header>Per-region TextArea:</Header>
          <TextArea name="text-text-per-region" toName="text" perRegion="true"/>
          <Header>Per-region Taxonomy:</Header>
          <Taxonomy name="text-taxonomy-per-region" toName="text" value="$dynamicTaxonomy" perRegion="true">
            <Choice value="Text Per-Region Taxonomy Choice 1"/>
            <Choice value="Text Per-Region Taxonomy Choice 2"/>
          </Taxonomy>
        </View>
      </View>
      <!-- Text Global classifications -->
      <Header>Global classifications:</Header>
      <View className="in-config-block">
        <Header>Choices:</Header>
        <Choices name="text-choices" toName="text" value="$dynamicChoices">
          <Choice value="Text Choice 1"/>
          <Choice value="Text Choice 2"/>
        </Choices>
        <Header>DateTime:</Header>
        <DateTime name="text-date" toName="text"/>
        <Header>Number:</Header>
        <Number name="text-number" toName="text"/>
        <Header>TextArea:</Header>
        <TextArea name="text-text" toName="text"/>
        <Header>Taxonomy:</Header>
        <Taxonomy name="text-taxonomy" toName="text" value="$dynamicTaxonomy">
          <Choice value="Text Taxonomy Choice 1"/>
          <Choice value="Text Taxonomy Choice 2"/>
        </Taxonomy>
      </View>
    </View>
    <!-- HyperText -->
    <View className="in-config-block">
      <Header>HyperText:</Header>
      <HyperText name="hypertext" value="$hypertext"/>
      <HyperTextLabels name="hypertext-labels" toName="hypertext" value="$dynamicLabels">
        <Label value="HyperText Label 1"/>
        <Label value="HyperText Label 2"/>
      </HyperTextLabels>
      <!-- HyperText Per-region classifications -->
      <View visibleWhen="region-selected" whenTagName="hypertext-labels">
        <Header>Per-region classification:</Header>
        <View className="in-config-block">
          <Header>Per-region Choices:</Header>
          <Choices name="hypertext-choices-per-region" toName="hypertext" value="$dynamicChoices" perRegion="true">
            <Choice value="HyperText Per-Region Choice 1"/>
            <Choice value="HyperText Per-Region Choice 2"/>
          </Choices>
          <Header>Per-region DateTime:</Header>
          <DateTime name="hypertext-date-per-region" toName="hypertext" perRegion="true"/>
          <Header>Per-region Number:</Header>
          <Number name="hypertext-number-per-region" toName="hypertext" perRegion="true"/>
          <Header>Per-region TextArea:</Header>
          <TextArea name="hypertext-per-region" toName="hypertext" perRegion="true"/>
          <Header>Per-region Taxonomy:</Header>
          <Taxonomy name="hypertext-taxonomy-per-region" toName="hypertext" value="$dynamicTaxonomy" perRegion="true">
            <Choice value="HyperText Per-Region Taxonomy Choice 1"/>
            <Choice value="HyperText Per-Region Taxonomy Choice 2"/>
          </Taxonomy>
        </View>
      </View>
      <!-- HyperText Global classifications -->
      <Header>Global classifications:</Header>
      <View className="in-config-block">
        <Header>Choices:</Header>
        <Choices name="hypertext-choices" toName="hypertext" value="$dynamicChoices">
          <Choice value="HyperText Choice 1"/>
          <Choice value="HyperText Choice 2"/>
        </Choices>
        <Header>DateTime:</Header>
        <DateTime name="hypertext-date" toName="hypertext"/>
        <Header>Number:</Header>
        <Number name="hypertext-number" toName="hypertext"/>
        <Header>TextArea:</Header>
        <TextArea name="hypertext-text" toName="hypertext"/>
        <Header>Taxonomy:</Header>
        <Taxonomy name="hypertext-taxonomy" toName="hypertext" value="$dynamicTaxonomy">
          <Choice value="HyperText Taxonomy Choice 1"/>
          <Choice value="HyperText Taxonomy Choice 2"/>
        </Taxonomy>
      </View>
    </View>
    <!-- TimeSeries -->
    <View className="in-config-block">
      <Header>TimeSeries:</Header>
      <TimeSeries name="timeseries"
                  valueType="json"
                  value="$timeseries"
                  timeColumn="time"
                  overviewChannels="velocity"
      >
        <Channel column="value"/>
      </TimeSeries>
      <TimeSeriesLabels name="timeseries-labels" toName="timeseries" value="$dynamicLabels">
        <Label value="TimeSeries Label 1"/>
        <Label value="TimeSeries Label 2"/>
      </TimeSeriesLabels>
      <!-- TimeSeries Per-region classifications -->
      <View visibleWhen="region-selected" whenTagName="timeseries-labels">
        <Header>Per-region classification:</Header>
        <View className="in-config-block">
          <Header>Per-region Choices:</Header>
          <Choices name="timeseries-choices-per-region" toName="timeseries" value="$dynamicChoices" perRegion="true">
            <Choice value="TimeSeries Per-Region Choice 1"/>
            <Choice value="TimeSeries Per-Region Choice 2"/>
          </Choices>
          <Header>Per-region DateTime:</Header>
          <DateTime name="timeseries-date-per-region" toName="timeseries" perRegion="true"/>
          <Header>Per-region Number:</Header>
          <Number name="timeseries-number-per-region" toName="timeseries" perRegion="true"/>
          <Header>Per-region TextArea:</Header>
          <TextArea name="timeseries-per-region" toName="timeseries" perRegion="true"/>
          <Header>Per-region Taxonomy:</Header>
          <Taxonomy name="timeseries-taxonomy-per-region" toName="timeseries" value="$dynamicTaxonomy" perRegion="true">
            <Choice value="TimeSeries Per-Region Taxonomy Choice 1"/>
            <Choice value="TimeSeries Per-Region Taxonomy Choice 2"/>
          </Taxonomy>
        </View>
      </View>
      <!-- TimeSeries Global classifications -->
      <Header>Global classifications:</Header>
      <View className="in-config-block">
        <Header>Choices:</Header>
        <Choices name="timeseries-choices" toName="timeseries" value="$dynamicChoices">
          <Choice value="TimeSeries Choice 1"/>
          <Choice value="TimeSeries Choice 2"/>
        </Choices>
        <Header>DateTime:</Header>
        <DateTime name="timeseries-date" toName="timeseries"/>
        <Header>Number:</Header>
        <Number name="timeseries-number" toName="timeseries"/>
        <Header>TextArea:</Header>
        <TextArea name="timeseries-text" toName="timeseries"/>
        <Header>Taxonomy:</Header>
        <Taxonomy name="timeseries-taxonomy" toName="timeseries" value="$dynamicTaxonomy">
          <Choice value="TimeSeries Taxonomy Choice 1"/>
          <Choice value="TimeSeries Taxonomy Choice 2"/>
        </Taxonomy>
      </View>
    </View>
    <!-- Video -->
    <View className="in-config-block">
      <Header>Video:</Header>
      <Video name="video" value="$video"/>
      <VideoRectangle name="video-rectangle" toName="video"/>
      <Labels name="video-labels" toName="video" value="$dynamicLabels">
        <Label value="Video Label 1"/>
        <Label value="Video Label 2"/>
      </Labels>
      <!-- Video Per-region classifications -->
      <View visibleWhen="region-selected" whenTagName="video-labels">
        <Header>Per-region classification:</Header>
        <View className="in-config-block">
          <Header>Per-region Choices:</Header>
          <Choices name="video-choices-per-region" toName="video" value="$dynamicChoices" perRegion="true">
            <Choice value="Video Per-Region Choice 1"/>
            <Choice value="Video Per-Region Choice 2"/>
          </Choices>
          <Header>Per-region DateTime:</Header>
          <DateTime name="video-date-per-region" toName="video" perRegion="true"/>
          <Header>Per-region Number:</Header>
          <Number name="video-number-per-region" toName="video" perRegion="true"/>
          <Header>Per-region TextArea:</Header>
          <TextArea name="video-per-region" toName="video" perRegion="true"/>
          <Header>Per-region Taxonomy:</Header>
          <Taxonomy name="video-taxonomy-per-region" toName="video" value="$dynamicTaxonomy" perRegion="true">
            <Choice value="Video Per-Region Taxonomy Choice 1"/>
            <Choice value="Video Per-Region Taxonomy Choice 2"/>
          </Taxonomy>
        </View>
      </View>
      <!-- Video Global classifications -->
      <Header>Global classifications:</Header>
      <View className="in-config-block">
        <Header>Choices:</Header>
        <Choices name="video-choices" toName="video" value="$dynamicChoices">
          <Choice value="Video Choice 1"/>
          <Choice value="Video Choice 2"/>
        </Choices>
        <Header>DateTime:</Header>
        <DateTime name="video-date" toName="video"/>
        <Header>Number:</Header>
        <Number name="video-number" toName="video"/>
        <Header>TextArea:</Header>
        <TextArea name="video-text" toName="video"/>
        <Header>Taxonomy:</Header>
        <Taxonomy name="video-taxonomy" toName="video" value="$dynamicTaxonomy">
          <Choice value="Video Taxonomy Choice 1"/>
          <Choice value="Video Taxonomy Choice 2"/>
        </Taxonomy>
      </View>
    </View>
    <!-- Table -->
    <View className="in-config-block">
      <Header>Table:</Header>
      <Table name="table" value="$table"/>
    </View>
    <!-- List -->
    <View className="in-config-block">
      <Header>List + Ranker:</Header>
      <List name="list" value="$list"/>
      <Ranker name="rank" toName="list"/>
    </View>
    <!-- Collapse -->
    <View className="in-config-block">
      <Header>Collapse:</Header>
      <Collapse>
        <Panel value="First panel">
          <Choices name="panel_1_choices" toName="image">
            <Choice value="Panel 1 Inner Element"/>
          </Choices>
        </Panel>
        <Panel value="$panel_2">
          <Labels name="panel_2_labels" toName="image">
            <Label value="Panel 2 Inner Element"/>
          </Labels>
        </Panel>
      </Collapse>
    </View>

    <Relations>
      <Relation value="similar"/>
      <Relation value="dissimilar"/>
    </Relations>
  </View>`;

export const allTagsSampleData = {
  audio: "/public/files/barradeen-emotional.mp3",
  textarea: "Something",
  image: "https://data.heartex.net/open-images/train_0/mini/00155094b7acc33b.jpg",
  mig: [
    "https://data.heartex.net/open-images/train_0/mini/0030019819f25b28.jpg",
    "https://data.heartex.net/open-images/train_0/mini/00155094b7acc33b.jpg",
    "https://data.heartex.net/open-images/train_0/mini/00133643bbf063a9.jpg",
    "https://data.heartex.net/open-images/train_0/mini/0061ec6e9576b520.jpg",
  ],
  paragraphs: [
    {
      author: "Alice",
      text: "Hi, Bob.",
    },
    {
      author: "Bob",
      text: "Hello, Alice!",
    },
    {
      author: "Alice",
      text: "What's up?",
    },
    {
      author: "Bob",
      text: "Good. Ciao!",
    },
    {
      author: "Alice",
      text: "Bye, Bob.",
    },
  ],
  text: "To have faith is to trust yourself to the water",
  labels: [
    {
      value: "DynamicLabel1",
      background: "#ff0000",
    },
    {
      value: "DynamicLabel2",
      background: "#0000ff",
    },
  ],
  hypertext:
    '<div style="max-width: 750px"><div style="clear: both"><div style="float: right; display: inline-block; border: 1px solid #F2F3F4; background-color: #F8F9F9; border-radius: 5px; padding: 7px; margin: 10px 0;"><p><b>Jules</b>: No no, Mr. Wolfe, it\'s not like that. Your help is definitely appreciated.</p></div></div><div style="clear: both"><div style="float: right; display: inline-block; border: 1px solid #F2F3F4; background-color: #F8F9F9; border-radius: 5px; padding: 7px; margin: 10px 0;"><p><b>Vincent</b>: Look, Mr. Wolfe, I respect you. I just don\'t like people barking orders at me, that\'s all.</p></div></div><div style="clear: both"><div style="display: inline-block; border: 1px solid #D5F5E3; background-color: #EAFAF1; border-radius: 5px; padding: 7px; margin: 10px 0;"><p><b>The Wolf</b>: If I\'m curt with you, it\'s because time is a factor. I think fast, I talk fast, and I need you two guys to act fast if you want to get out of this. So pretty please, with sugar on top, clean the car.</p></div></div></div>',
  hyperlabels: [
    {
      value: "DynamicLabel1",
      background: "#ff0000",
    },
    {
      value: "DynamicLabel2",
      background: "#0000ff",
    },
  ],
  timeseries: {
    time: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
      31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58,
      59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86,
      87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99,
    ],
    value: [
      1.1393700565561184, 0.20582704993890064, -1.21497950745229, -1.8475063737801518, -0.9921640936838662,
      -1.7856764052654002, 0.08803347727939657, -0.30030806743697475, 1.1886285990561012, -0.8997862539954563,
      0.4386386140278205, -1.617681286537922, 1.0570918251017698, 0.3695480529252035, -0.8193787330027099,
      -1.6452726833960354, -0.20300362077113915, -0.9655914965805513, -0.5436994236105087, 1.3764502707321136,
      -0.07610240994539516, 0.009645716672409547, 1.1538673268929702, -0.08163253144562094, 1.3733527532107295,
      -1.0604906313482814, 0.6822721944838279, -0.747265839810174, 1.425576031959199, 3.111666837994423,
      -0.5575479617912177, -0.28367571432606675, -0.913926594859317, 0.9017484089920481, -0.23958534566950856,
      1.2309734907173973, -1.6002523044951367, -1.5260885270933928, 0.40390260840708536, -1.0389018115277513,
      1.9423513124098457, -0.1816417695958348, 0.0011235704235933379, -0.6119528614138618, 2.6595726046425017,
      0.3258537127236866, 1.8341358665725238, -1.683274818214394, -0.2665203538102121, -1.5196270317166107,
      0.12318788578554503, 1.349843886108512, -0.49489850459516155, -0.8027783785971654, 1.8745981568237153,
      0.5617289099765608, -0.6930023528515767, 0.5124410381811476, 0.35716862621283524, -1.6083279086774749,
      -0.8563171224625595, 0.6103553122342722, 0.29119600710898735, -0.5062927873950588, 0.7202372819487668,
      -0.556379796388418, 0.5042291138403985, 1.6908081057886755, -0.11727020985448582, 1.4691843985112925,
      -0.9777469139568521, -0.5978518348285874, 0.10788873147183885, -0.9872748684442015, -0.9670450247890969,
      0.5202384215780459, -0.650952517939342, -0.8386557602812781, 2.271626152656259, 0.1193771902186821,
      -0.21481510320485592, -1.5745360063327152, -0.3638714349463393, -1.724314328414918, 0.19847261441835293,
      -0.39445345287931144, 0.6040967817549395, -0.254140452574494, 0.4615027200678019, -0.026514865719184152,
      -0.5613417378438901, -0.651165223727383, -0.6320938538500689, -0.693915469899149, -0.29540004821017224,
      -0.02136517411410101, -0.05453917109641203, 0.23405947261470622, 0.5217008076413946, 1.5041477814013535,
    ],
  },
  video: "./public/files/opossum_intro.webm",
  table: {
    "Card number": 18799210,
    "First name": "Max",
    "Last name": "Nobel",
  },
  taxonomy: "Something",
  list: [
    {
      id: 1,
      title: "The Amazing World of Opossums",
      body: "Opossums are fascinating marsupials native to North America. They have prehensile tails, which help them to climb trees and navigate their surroundings with ease. Additionally, they are known for their unique defense mechanism, called 'playing possum,' where they mimic the appearance and smell of a dead animal to deter predators.",
    },
    {
      id: 2,
      title: "Opossums: Nature's Pest Control",
      body: "Opossums play a crucial role in controlling insect and rodent populations, as they consume a variety of pests like cockroaches, beetles, and mice. This makes them valuable allies for gardeners and homeowners, as they help to maintain a balanced ecosystem and reduce the need for chemical pest control methods.",
    },
    {
      id: 3,
      title: "Fun Fact: Opossums Are Immune to Snake Venom",
      body: "One surprising characteristic of opossums is their natural immunity to snake venom. They have a unique protein in their blood called 'Lethal Toxin-Neutralizing Factor' (LTNF), which neutralizes venom from a variety of snake species, including rattlesnakes and cottonmouths. This allows opossums to prey on snakes without fear of harm, further highlighting their important role in the ecosystem.",
    },
  ],
  panel_2: "Another panel",
  dynamicLabels: [{ value: "Dynamic Label 1" }],
  dynamicChoices: [{ value: "Dynamic Choice 1" }],
  dynamicTaxonomy: [{ value: "Dynamic Taxonomy Choice 1" }],
};
