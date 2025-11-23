### Parameters

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | Name of the element |
| toName | <code>string</code> |  | Name of the image to label |
| [opacity] | <code>float</code> | <code>0.6</code> | Opacity of the Magic Wand region during use |
| [blurradius] | <code>number</code> | <code>5</code> | The edges of a Magic Wand region are blurred and simplified, this is the radius of the blur kernel |
| [defaultthreshold] | <code>number</code> | <code>15</code> | When the user initially clicks without dragging, how far a color has to be from the initial selected pixel to also be selected |

### Result parameters

| Name | Type | Description |
| --- | --- | --- |
| original_width | <code>number</code> | Width of the original image (px) |
| original_height | <code>number</code> | Height of the original image (px) |
| image_rotation | <code>number</code> | Rotation degree of the image (deg) |
| value | <code>Object</code> |  |
| value.format | <code>&quot;rle&quot;</code> | Format of the masks, only RLE is supported for now |
| value.rle | <code>Array.&lt;number&gt;</code> | RLE-encoded image |

### Example JSON
```json
{
  "original_width": 1920,
  "original_height": 1280,
  "image_rotation": 0,
  "value": {
    "format": "rle",
    "rle": [0, 1, 1, 2, 3],
    "brushlabels": ["Car"]
  }
}
```

