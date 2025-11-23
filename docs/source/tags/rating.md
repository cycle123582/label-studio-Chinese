---
title: Rating
type: tags
order: 420
meta_title: Rating Tag for Ratings
meta_description: Customize Label Studio to add ratings to tasks with the Rating tag in your machine learning and data science projects.
---

The `Rating` tag adds a rating selection to the labeling interface. Use for labeling tasks involving ratings.

Use with the following data types: audio, image, HTML, paragraphs, text, time series, video.

{% insertmd includes/tags/rating.md %}

### Example

Basic labeling configuration to rate the content of a text passage

```html
<View>
  <Text name="txt" value="$text" />
  <Rating name="rating" toName="txt" maxRating="10" icon="star" size="medium" />
</View>
```
