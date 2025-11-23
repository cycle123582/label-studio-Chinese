# Vector Segmentation Template

This template demonstrates how to use the Vector tag for vector-based image
segmentation tasks.

## Labeling Configuration

```html
<View>
    <header value="Select label and click the image to start" />
    <Image name="image" value="$image" zoom="true" />
    <VectorLabels
        name="label"
        toName="image"
        strokeWidth="3"
        pointSize="small"
        opacity="0.9"
        closable="true"
        curves="true"
    >
        <label value="Road" background="red" />
        <label value="Boundary" background="blue" />
        <label value="Path" background="green" />
    </VectorLabels>
</View>
```

## About the labeling configuration

All labeling configurations must be wrapped in [View](/tags/view.html) tags.

You can add a [header](/tags/header.html) to provide instructions to the
annotator:

```xml
<Header value="Select label and click the image to start"/>
```

Use the [Image](/tags/image.html) object tag to specify the image data and allow
annotators to zoom the image:

```xml
<Image name="image" value="$image" zoom="true"/>
```

Use the [VectorLabels](/tags/vectorlabels.html) control tag to allow annotators
to create vectors for specific labels.

```xml
<VectorLabels name="label" toName="image"
              strokeWidth="3" pointSize="small"
              opacity="0.9" closable="true" curves="true">
  <Label value="Road" background="red"/>
  <Label value="Boundary" background="blue"/>
  <Label value="Path" background="green"/>
</VectorLabels>
```

Annotators can control the opacity of the vectors using the `opacity` argument,
and the styling of the vector tool using the `pointSize` and `strokeWidth`
arguments. Use the `background` argument with the [Label](/tags/label.html)
control tag to control the color of each vector.

The `closable="true"` parameter allows vectors to be closed into polygons, while
`curves="true"` enables Bezier curve creation for smooth vector paths.

## Related tags

- [Header](/tags/header.html)
- [Image](/tags/image.html)
- [VectorLabels](/tags/vectorlabels.html)
- [Label](/tags/label.html)
