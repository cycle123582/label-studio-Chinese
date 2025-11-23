---
title: Medical Image Classification with Bounding Boxes
type: templates
category: Computer Vision
cat: computer-vision
order: 160
meta_title: Medical Image Classification with Bounding Boxes Template
meta_description: Template for classifying medical images and using bounding boxes for image segmentation.
---


<img src="/images/templates/medical-image-classification.png" alt="" class="gif-border" width="552px" height="408px" />

This template interface allows annotators to:
- Draw bounding boxes around areas identified as tumors in the image using the "Tumor" label.
- Classify the entire image by selecting one of "Benign", "Malignant", or "Normal".

This setup is useful in medical imaging tasks where you need to localize tumors and also provide an overall assessment of the image.

## Labeling configuration

```xml
<View>
  <Image name="image" value="$image"/>
  <RectangleLabels name="label" toName="image">
    <Label value="Tumor" background="green"/>
  </RectangleLabels>
  <Choices name="classification" toName="image">
    <Choice value="Benign"/>
    <Choice value="Malignant"/>
    <Choice value="Normal"/>
  </Choices>
</View>
```

## About the labeling configuration

#### Image

```xml
<Image name="image" value="$image"/>
```

This displays the image. The `value="$image"` means it will use the image field from your task data.

!!! info Tip
    For example images, you can use a sample dataset available from [kaggle](https://www.kaggle.com/datasets/aryashah2k/breast-ultrasound-images-dataset?resource=download). 


#### Bounding boxes

```xml
<RectangleLabels name="label" toName="image">
  <Label value="Tumor" background="green"/>
</RectangleLabels>
```
This defines the image segmentation you can use. In this template, you're drawing rectangles (bounding boxes). 

- The `RectangleLabels` tag creates a tool for drawing bounding boxes, and `toName="image"` means that the boxes will be associated with the tag named `image` (which in this example is the name assigned to the `<Image>` tag). 
- The `Label` tag specifies that the bounding boxes represent "Tumor" regions, displayed with a green background.

For more information about working with bounding boxes, see [Object Detection with Bounding Boxes](image_bbox). 

#### Classification

```xml
<Choices name="classification" toName="image">
  <Choice value="Benign"/>
  <Choice value="Malignant"/>
  <Choice value="Normal"/>
</Choices>
```

This adds image-level classification choices. 

- The `<Choices>` tag provides a set of options for annotators to select.
- `toName="image"` applies these choices to the entire image.
- Annotators can classify the image as "Benign", "Malignant", or "Normal".

You can change these classification options by editing them, adding more, or deleting them. If your needs are more complex, you can also use [nested choices](image_classification#Enhance-classification-templates-with-nested-choices). 


## Related tags

- [Image](/tags/image.html)
- [RectangleLabels](/tags/rectanglelabels.html)
- [Choices](/tags/choices.html)
