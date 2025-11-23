Feature("Video unmount").tag("@regress").config({ waitForAction: 100 });

Scenario("Reiniting Label Studio should not left unexpected null and video tags in DOM", async ({ I, LabelStudio }) => {
  I.amOnPage("/");
  for (let i = 0; i < 60; i++) {
    LabelStudio.init({
      config: `
<View>
  <Video name="video" value="$video" />
  <VideoRectangle name="box" toName="video" />
</View>`,
      data: { video: "./public/files/opossum_intro.webm" },
    });

    // Add a small delay to ensure proper cleanup between reinitializations
    // Note that for the smaller values, NODE_ENV=development results in slower cleanup for mounted components (likely due to MobX providers)
    // and fails the test with "Reiniting Label Studio should not left unexpected null and video tags in DOM:"
    // However, we need NODE_ENV=development to collect coverage
    I.wait(0.1);
  }
  I.dontSeeElementInDOM({ xpath: "//body/video[position()=2]" });
  I.dontSee("null");
});
