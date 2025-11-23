---
title: Optical Character Recognition for License Plate Recognition
type: templates
hide_menu: true
category: Computer Vision
cat: computer-vision
order: 1103
meta_description: Template for using Label Studio to perform optical character recognition (OCR).
---

![Screenshot of labeling interface](/images/templates-misc/plates.png)

Accurate Optical Character Recognition (OCR) labeled data is essential for AI models tasked with identifying and interpreting license plates, enabling real-time vehicular identification and management in various applications, from law enforcement to automated toll collection. These models must effectively parse a diverse array of license plate formats, layouts, and fonts, necessitating the highest possible accuracy in label quality to ensure robust performance.

However, labeling data for license plate recognition presents significant challenges, including time-intensive manual processes, inconsistent labeling standards due to varying annotator expertise, and the need for domain-specific knowledge to handle edge cases effectively. Label Studio tackles these challenges head-on with its innovative hybrid AI + human-in-the-loop approach that combines AI-assisted pre-labeling to jumpstart the annotation process, significantly reducing labeling time and improving consistency. Our platform also empowers subject matter experts through collaborative tools for real-time feedback and validation, while customizable templates ensure that the labeling interface is tailored specifically to the license plate recognition task, thereby enhancing annotator efficiency and driving scalable workflows. By streamlining the data labeling process, Label Studio not only accelerates project timelines but also maximizes model performance, ensuring your OCR systems are finely tuned for high-stakes applications.

## Labeling configuration

```html
<View>
  <Image name="image" value="$ocr"/>
  <Labels name="label" toName="image">
    <Label value="License Plate Number" background="green"/>
    <Label value="State Code" background="blue"/>
    <Label value="Country Code" background="orange"/>
    <Label value="Special Characters" background="purple"/>
  </Labels>
  <Rectangle name="bbox" toName="image" strokeWidth="3"/>
  <Polygon name="poly" toName="image" strokeWidth="3"/>
  <TextArea name="transcription" toName="image"
            editable="true"
            perRegion="true"
            required="true"
            maxSubmissions="1"
            rows="5"
            placeholder="Transcribed License Plate Text"
            displayMode="region-list"
            />
</View>
```
This labeling configuration defines a framework for license plate recognition tasks. It allows annotators to label specific regions on an image using rectangles or polygons and then transcribe the detected license plate text within those regions.

```xml
<Image name="image" value="$ocr"/>
```
Use the `<Image>` tag to specify the vehicle image containing the license plate to be labeled.

```xml
<Labels name="label" toName="image">
    <Label value="License Plate Number" background="green"/>
    <Label value="State Code" background="blue"/>
    <Label value="Country Code" background="orange"/>
    <Label value="Special Characters" background="purple"/>
</Labels>
```
Use the `<Labels>` tag to define which specific license plate components are available for annotators to apply, such as the main plate number, state or province codes, and any country codes or special characters.

```xml
<Rectangle name="bbox" toName="image" strokeWidth="3"/>
```
The `<Rectangle>` tag is used to enable drawing unlabeled bounding boxes around license plate regions in the image to isolate each area to be transcribed.

```xml
<Polygon name="poly" toName="image" strokeWidth="3"/>
```
The `<Polygon>` tag enables annotators to mark polygonal regions around irregular license plate shapes or to follow the contours of a plate.

```xml
<TextArea name="transcription" toName="image"
            editable="true"
            perRegion="true"
            required="true"
            maxSubmissions="1"
            rows="5"
            placeholder="Transcribed License Plate Text"
            displayMode="region-list"
            />
```
The `<TextArea>` tag allows transcribing the text detected within each labeled license plate region. The transcription is editable and required for submission, and each text box corresponds to a specific region drawn on the image.
