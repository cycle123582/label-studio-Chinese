export const imageWithRectanglesConfig = `<View>
 <Image name="image" value="$image" />
 <Rectangle name="rect" toName="image" />
</View>`;

export const imageWithBrushConfig = `<View>
    <Image name="image" value="$image" />
    <Brush name="brush" toName="image" />
</View>`;

export const imageWithBothToolsConfig = `<View>
    <Image name="image" value="$image" />
    <Rectangle name="rect" toName="image" />
    <Brush name="brush" toName="image" />
</View>`;

export const imageData = {
  image:
    "https://htx-pub.s3.us-east-1.amazonaws.com/examples/images/nick-owuor-astro-nic-visuals-wDifg5xc9Z4-unsplash.jpg",
};
