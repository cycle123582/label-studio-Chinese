import { AudioView, LabelStudio, Paragraphs } from "@humansignal/frontend-test/helpers/LSF";
import { Network } from "@humansignal/frontend-test/helpers/utils";
import { fullOpossumSnowData, videoAudioParagraphsConfig } from "../../../data/sync/video-audio-paragraphs";

// Local type extensions for this test
type TestWindow = Cypress.AUTWindow & {
  _wasBuffered?: boolean;
  _playedPhrases?: Set<number>;
  _totalPhrases?: number;
};

describe("Sync buffering playback", () => {
  beforeEach(() => {
    LabelStudio.addFeatureFlagsOnPageLoad({
      fflag_fix_front_fit_31_synced_media_buffering: true,
      fflag_feat_front_lsdv_e_278_contextual_scrolling_short: true,
    });
    Network.disableBrowserCache();
    cy.reload(true);
    cy.on("uncaught:exception", () => false);
  });

  afterEach(() => {
    Network.clearAllThrottles();
    Network.enableBrowserCache();
  });

  it.skip("should go though all paragraphs during playback with buffering", () => {
    let attempts = 3;
    const testScenario = () => {
      LabelStudio.params().config(videoAudioParagraphsConfig).data(fullOpossumSnowData).withResult([]).init();

      LabelStudio.waitForObjectsReady();
      AudioView.isReady();
      Paragraphs.mediaElement.should("exist");

      cy.window().then((win: TestWindow) => {
        const testWin = win as TestWindow;
        testWin._wasBuffered = false;
        testWin._playedPhrases = new Set();
        testWin._totalPhrases = fullOpossumSnowData.text.length;

        AudioView.root.then(($audioRoot) => {
          let bufferingObserver: MutationObserver | null = null;
          let buttonObserver: MutationObserver | null = null;

          const checkBuffering = () => {
            const bufferingIndicators = win.document.querySelectorAll(AudioView._bufferingIndicatorSelector);
            const isBuffering = bufferingIndicators.length > 0;
            if (isBuffering) {
              testWin._wasBuffered = true;
              bufferingObserver?.disconnect();
            }
          };

          const checkAttributeChanges = (mutations: MutationRecord[]) => {
            mutations.forEach((mutation) => {
              const button = mutation.target as HTMLButtonElement;
              if (button.getAttribute("aria-label") === "pause") {
                const phraseElement = button.parentElement?.querySelector('[data-testid^="phrase:"]');
                if (phraseElement) {
                  const phraseId = phraseElement.getAttribute("data-testid")?.replace("phrase:", "");
                  if (phraseId) {
                    testWin._playedPhrases!.add(Number.parseInt(phraseId));
                  }
                }
              }
            });
          };

          // Get all phrase buttons once and observe them specifically
          const phraseButtons = win.document.querySelectorAll('[class^="phraseContainer--"] button[aria-label]');

          const bufferingConfig = { childList: true, subtree: true };
          const attributeConfig = { attributes: true, attributeFilter: ["aria-label"] };

          bufferingObserver = new MutationObserver(checkBuffering);
          buttonObserver = new MutationObserver(checkAttributeChanges);

          bufferingObserver.observe($audioRoot[0], bufferingConfig);

          // Observe each phrase button individually for attribute changes
          phraseButtons.forEach((button) => {
            buttonObserver.observe(button, attributeConfig);
          });
        });
      });

      // Set playback speed to 2x to save some time
      AudioView.setPlaybackSpeedInput(2);

      // Slow down the network
      Network.throttleNetwork("/public/files/opossum_snow.mp4", 75, "throttled_mp4");

      AudioView.playButton.click();

      // Wait for audio playback to complete
      AudioView.mediaElement.its(0, { timeout: 1000 * 60 * 10 }).should(($media: any) => {
        const mediaElement = $media as HTMLMediaElement;

        expect(mediaElement.currentTime).to.be.greaterThan(41);
      });

      // Check that all phrases were played
      cy.window().then((win) => {
        const testWin = win as TestWindow;
        expect(testWin._playedPhrases!.size).to.equal(testWin._totalPhrases);
      });
    };
    testScenario();
    cy.window().then((win) => {
      const testWin = win as TestWindow;
      if (!testWin._wasBuffered && attempts-- > 1) {
        testScenario();
      }
    });
  });
});
