---
title: ASR Hypotheses Selection
type: templates
category: Ranking and Scoring
cat: ranking-and-scoring
order: 435
meta_title: Choose the most accurate Automatic Speech Recognition (ASR) hypotheses
meta_description: 
---

When you work with automatic speech transcribers, you are provided with several transcription hypotheses. Now, you can select one of the variations from the list of transcription hypotheses.
<br/>

<img src="/images/templates/asr-hypotheses.png" alt="ASR Hypotheses Selection example" class="gif-border" width="552px" height="408px" />

## Labeling Configuration

```xml
<View>
  <Audio name="audio" value="$audio"/>
  <Choices name="transcriptions" toName="audio" value="$transcriptions" selection="highlight"/>
  <Style>
    .lsf-choice__item {
      padding: var(--spacing-tighter) var(--spacing-tight);
      box-shadow: 0 2px 4px rgba(var(--color-neutral-shadow-raw) / calc(16% * var(--shadow-intensity))) ;
      background-color: var(--color-neutral-background);
      border-radius: var(--corner-radius-small);
      margin: 0 var(--spacing-tighter) var(--spacing-tighter) var(--spacing-tighter);
      line-height: 1.6rem;
      transition: all 150ms ease-out;
    }
    
    .lsf-choice__item:hover {
      background-color: var(--color-primary-emphasis-subtle);
    }
  </Style>
</View>
```

## Example data

```json
{
  "data": {
    "audio": "https://htx-pub.s3.amazonaws.com/datasets/audio/f2btrop6.0.wav",
    "transcriptions": [{
      "value": "potrostith points out that if school based clinics were established parental permission would be required for students to receive each service offered"
    }, {
      "value": "potrostith points out that if school-based clinics were established parental permission would be required for students to receive each service offered"
    }, {
      "value": "purporting points out that if school based clinics were established parental permission would be required for students to receive each service offered"
    }, {
      "value": "pork roasted points out that if school based clinics were establish parental permission would be required for students to receive each service offered"
    }, {
      "value": "purpose it points out that if school based clinics war establish parental permission would be required for students to receive each service offered"
    }]
  }
}
```
