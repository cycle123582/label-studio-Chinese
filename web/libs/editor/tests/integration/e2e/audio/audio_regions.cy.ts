import { AudioView, Labels, LabelStudio, Relations } from "@humansignal/frontend-test/helpers/LSF";
import { audioOneRegionResult, audioWithLabelsConfig, audioWithLabelsData } from "../../data/audio/audio_regions";

// Audio regions test suite with improved stability through canvas synchronization
// Reduced retries from 3 to 1 due to improved timing and pixel sampling reliability
const suiteConfig = {
  retries: {
    runMode: 1,
    openMode: 0,
  },
};

describe("Audio regions", suiteConfig, () => {
  it("Should have indication of selected state", () => {
    cy.log("=== Testing audio region selected state indication ===");
    LabelStudio.params()
      .config(audioWithLabelsConfig)
      .data(audioWithLabelsData)
      .withResult(audioOneRegionResult)
      .init();

    LabelStudio.waitForObjectsReady();
    AudioView.isReady();

    // Wait for initial canvas rendering to stabilize
    AudioView.waitForCanvasStable();
    const baseRegionColor = AudioView.getStablePixelColorRelative(0.36, 0.9);

    // Click to select region and wait for state transition
    AudioView.clickAtRelative(0.38, 0.5);
    AudioView.waitForCanvasStable();
    const selectedRegionColor = AudioView.getStablePixelColorRelative(0.36, 0.9);

    selectedRegionColor.then((color) => {
      baseRegionColor.should("not.deep.equal", color);
    });

    // Unselecting with ESC key
    cy.get("body").type("{esc}");
    AudioView.waitForCanvasStable();
    const unselectedRegionColor = AudioView.getStablePixelColorRelative(0.36, 0.9);

    unselectedRegionColor.then((color) => {
      baseRegionColor.should("deep.equal", color);
    });
  });

  it("Should have indication of active state", () => {
    cy.log("=== Testing audio region active state indication ===");
    LabelStudio.params()
      .config(audioWithLabelsConfig)
      .data(audioWithLabelsData)
      .withResult(audioOneRegionResult)
      .init();

    LabelStudio.waitForObjectsReady();
    AudioView.isReady();

    // Wait for audio visualization to stabilize before capturing baseline
    AudioView.waitForCanvasStable();
    const baseRegionColor = AudioView.getStablePixelColorRelative(0.36, 0.9);

    // Moving the cursor to activate region
    AudioView.seekCurrentTimebox(38);
    // Allow time for active state rendering to complete
    AudioView.waitForCanvasStable();
    const activeRegionColor = AudioView.getStablePixelColorRelative(0.36, 0.9);

    activeRegionColor.then((color) => {
      baseRegionColor.should("not.deep.equal", color);
    });

    // Deactivating by moving cursor away
    AudioView.seekCurrentTimebox(0);
    // Wait for inactive state to be fully rendered
    AudioView.waitForCanvasStable();
    const inactiveRegionColor = AudioView.getStablePixelColorRelative(0.36, 0.9);

    inactiveRegionColor.then((color) => {
      baseRegionColor.should("deep.equal", color);
    });
  });

  it("Should have indication of highlighted state", () => {
    cy.log("=== Testing audio region highlighted state indication ===");
    LabelStudio.params()
      .config(audioWithLabelsConfig)
      .data(audioWithLabelsData)
      .withResult(audioOneRegionResult)
      .init();

    LabelStudio.waitForObjectsReady();
    AudioView.isReady();

    // Wait for initial rendering to stabilize
    AudioView.waitForCanvasStable();
    const baseRegionColor = AudioView.getStablePixelColorRelative(0.36, 0.9);

    // Set up highlighting in relations mode
    Labels.select("Music");
    AudioView.drawRectRelative(0.1, 0.5, 0.1, 0, { force: true });
    AudioView.clickAtRelative(0.15, 0.5);
    Relations.toggleCreation();

    // Hover to highlight region
    AudioView.hoverAtRelative(0.4, 0.5);
    AudioView.waitForCanvasStable();
    const highlightedRegionColor = AudioView.getStablePixelColorRelative(0.36, 0.9);

    highlightedRegionColor.then((color) => {
      baseRegionColor.should("not.deep.equal", color);
    });

    // Unhighlighting by mouse leave
    AudioView.container.trigger("mouseleave");
    AudioView.waitForCanvasStable();
    const unhighlightedRegionColor = AudioView.getStablePixelColorRelative(0.36, 0.9);

    unhighlightedRegionColor.then((color) => {
      baseRegionColor.should("deep.equal", color);
    });
  });

  it("Should avoid intersection of active and highlighted states", () => {
    cy.log("=== Testing audio region state intersection avoidance ===");
    LabelStudio.params()
      .config(audioWithLabelsConfig)
      .data(audioWithLabelsData)
      .withResult(audioOneRegionResult)
      .init();

    LabelStudio.waitForObjectsReady();
    AudioView.isReady();

    // Wait for initial rendering to stabilize
    AudioView.waitForCanvasStable();
    const baseRegionColor = AudioView.getStablePixelColorRelative(0.36, 0.9);

    // Set up highlighting in relations mode
    Labels.select("Music");
    AudioView.drawRectRelative(0.1, 0.5, 0.1, 0, { force: true });
    AudioView.clickAtRelative(0.15, 0.5);
    Relations.toggleCreation();

    // Hover to highlight region
    AudioView.hoverAtRelative(0.4, 0.5);
    AudioView.waitForCanvasStable();
    const highlightedRegionColor = AudioView.getStablePixelColorRelative(0.36, 0.9);

    highlightedRegionColor.then((color) => {
      baseRegionColor.should("not.deep.equal", color);
    });

    // Moving the cursor to activate region (while still highlighted)
    AudioView.seekCurrentTimebox(38);
    AudioView.waitForCanvasStable();
    const activeRegionColor = AudioView.getStablePixelColorRelative(0.36, 0.9);

    activeRegionColor.then((color) => {
      baseRegionColor.should("not.deep.equal", color);
      highlightedRegionColor.should("deep.equal", color);
    });

    // Deactivating cursor (should still be highlighted)
    AudioView.seekCurrentTimebox(0);
    AudioView.waitForCanvasStable();
    const inactiveRegionColor = AudioView.getStablePixelColorRelative(0.36, 0.9);

    // Should still be highlighted
    inactiveRegionColor.then((color) => {
      baseRegionColor.should("not.deep.equal", color);
      highlightedRegionColor.should("deep.equal", color);
    });

    // Unhighlighting by mouse leave
    AudioView.container.trigger("mouseleave");
    AudioView.waitForCanvasStable();
    const unhighlightedRegionColor = AudioView.getStablePixelColorRelative(0.36, 0.9);

    unhighlightedRegionColor.then((color) => {
      baseRegionColor.should("deep.equal", color);
    });
  });
});
