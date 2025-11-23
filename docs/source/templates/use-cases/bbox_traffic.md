---
title: Object Detection with Bounding Boxes for Traffic Monitoring
type: templates
hide_menu: true
category: Computer Vision
cat: computer-vision
order: 1103
meta_description: Template for using Label Studio to perform object detection with rectangular bounding boxes for traffic monitoring.
---

![Screenshot of labeling interface with traffic monitoring image](/images/templates-misc/bbox-traffic.png)

Object Detection with Bounding Boxes labeled data is essential for AI-driven traffic monitoring models, enabling them to accurately identify and classify vehicles, pedestrians, and road signs in real-time. This capability is critical for enhancing traffic management systems, informing autonomous driving protocols, and improving road safety.

However, labeling data for traffic monitoring presents significant challenges. The process is often time-intensive and fraught with inconsistencies due to the complex and dynamic nature of traffic environments. Moreover, specialized domain expertise is often required to accurately interpret and label objects, further complicating the workflow. Label Studio effectively addresses these challenges with its robust hybrid AI + human-in-the-loop approach. By leveraging AI-assisted pre-labeling, our platform accelerates the initial labeling phase, allowing human annotators to focus on validation and refinement. Collaboration tools facilitate seamless communication among team members, while customizable templates ensure that specific domain requirements are met consistently. This results in not only improved model performance but also reduced labeling time and increased expert efficiency, allowing for scalable workflows that adapt to the needs of any traffic monitoring operation.

<a href="https://app.humansignal.com/b/NjYy"
  target="_blank" rel="noopener" aria-label="Open in Label Studio" style="all:unset;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;border-radius:4px;border:1px solid rgb(109,135,241);padding:8px 12px;background:rgb(87 108 193);color:white;font-weight:500;font-family:sans-serif;gap:6px;transition:background 0.2s ease;" onmouseover="this.style.background='rgb(97 122 218)'" onmouseout="this.style.background='rgb(87 108 193)'">
  <svg style="width:20px;height:20px" viewBox="0 0 26 26" fill="none"><path fill="#FFBAAA" d="M3.5 4.5h19v18h-19z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M25.7 7.503h-7.087V5.147H7.588V2.792h11.025V.436H25.7v7.067Zm-18.112 0H5.225v10.994H2.863V7.503H.5V.436h7.088v7.067Zm0 18.061v-7.067H.5v7.067h7.088ZM25.7 18.497v7.067h-7.088v-2.356H7.588v-2.355h11.025v-2.356H25.7Zm-2.363 0V7.503h-2.363v10.994h2.363Z" fill="#FF7557"/></svg>
  <span style="font-size:14px">Open in Label Studio</span>
  <svg style="width:16px;height:16px" viewBox="0 0 24 24"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" fill="white"/></svg>
</a>

## Labeling configuration

```html
<View>
  <Image name="image" value="$image"/>
  <RectangleLabels name="label" toName="image">
    <Label value="Vehicle" background="blue"/>
    <Label value="Pedestrian" background="green"/>
    <Label value="Traffic Light" background="red"/>
    <Label value="Bicycle" background="orange"/>
    <Label value="Road Sign" background="purple"/>
  </RectangleLabels>
</View>
```

This labeling configuration is enclosed within <a href="https://labelstud.io/tags/view">View</a> tags.

Use the <a href="https://labelstud.io/tags/image">Image</a> tag to specify the traffic scene image to annotate:

```xml
<Image name="image" value="$image"/>
```

Use the <a href="https://labelstud.io/tags/rectanglelabels">RectangleLabels</a> tag to add labels and rectangular bounding boxes for different traffic entities in the image. The <a href="https://labelstud.io/tags/label">Label</a> tags define distinct traffic-related categories and assign specific colors to their bounding boxes for clarity:

```xml
<RectangleLabels name="label" toName="image">
  <Label value="Vehicle" background="blue"/>
  <Label value="Pedestrian" background="green"/>
  <Label value="Traffic Light" background="red"/>
  <Label value="Bicycle" background="orange"/>
  <Label value="Road Sign" background="purple"/>
</RectangleLabels>
```

If you want to add further context to traffic monitoring tasks with bounding boxes, you can add some <strong>per-region</strong> conditional labeling parameters to your labeling configuration.

For example, to prompt annotators to add descriptions to detected traffic objects, you can add the following to your labeling configuration:

```html
<View visibleWhen="region-selected">
  <Header value="Describe traffic object" />
  <TextArea name="answer" toName="image" editable="true"
            perRegion="true" required="true" />
  <Choices name="choices" toName="image"
           perRegion="true">
    <Choice value="Operational"/>
    <Choice value="Malfunctioning"/>
    <Choice value="Obstructed"/>
    <Choice value="Damaged"/>
  </Choices>
</View>
```

The <code>visibleWhen</code> parameter of the <a href="https://labelstud.io/tags/view">View</a> tag hides the description prompt from annotators until a bounding box is selected.

After the annotator selects a bounding box, the <a href="https://labelstud.io/tags/header">Header</a> appears and provides instructions to annotators.

The <a href="https://labelstud.io/tags/textarea">TextArea</a> control tag displays an editable text box that applies to the selected bounding box, specified with the <code>perRegion="true"</code> parameter. You can also add a <code>placeholder</code> parameter to provide suggested text to annotators.

In addition, you can prompt annotators to provide additional feedback about the content of the bounding box, such as the operational status of the item in the box, using the <a href="https://labelstud.io/tags/choices">Choices</a> tag with the <code>perRegion</code> parameter.
