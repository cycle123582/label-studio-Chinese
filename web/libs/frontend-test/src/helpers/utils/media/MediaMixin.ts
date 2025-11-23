import type { MediaView, ViewWithMedia } from "./types";

export function withMedia<T extends new (...args: any[]) => ViewWithMedia>(
  Base: T,
): T & (new (...args: any[]) => MediaView) {
  return class extends Base implements MediaView {
    _bufferingIndicatorSelector = ".lsf-timeline-controls__buffering";
    get bufferingIndicator() {
      return this.root.get(this._bufferingIndicatorSelector);
    }
    /**
     * Check if Tag is in buffering state
     */
    hasBuffering() {
      this.bufferingIndicator.should("be.visible");
    }
    /**
     * Check if Tag is not in buffering state
     */
    hasNoBuffering() {
      this.bufferingIndicator.should("not.exist");
    }

    /**
     * Check if media is playing
     */
    hasMediaPlaying() {
      this.mediaElement.should(($media) => {
        const mediaElement = $media[0] as HTMLMediaElement;
        expect(mediaElement.paused).to.be.false;
      });
    }

    /**
     * Check if media is paused during buffering
     */
    hasMediaPaused() {
      this.mediaElement.should(($media) => {
        const mediaElement = $media[0] as HTMLMediaElement;
        expect(mediaElement.paused).to.be.true;
      });
    }

    /**
     * Get current media time
     */
    getCurrentTime(): Cypress.Chainable<number> {
      return this.mediaElement.then(($media) => {
        const mediaElement = $media[0] as HTMLMediaElement;
        return mediaElement.currentTime;
      });
    }

    /**
     * Get media duration
     */
    getDuration(): Cypress.Chainable<number> {
      return this.mediaElement.then(($media) => {
        const mediaElement = $media[0] as HTMLMediaElement;
        return mediaElement.duration;
      });
    }

    /**
     * Get media network state
     */
    getNetworkState(): Cypress.Chainable<number> {
      return this.mediaElement.then(($media) => {
        const mediaElement = $media[0] as HTMLMediaElement;
        return mediaElement.networkState;
      });
    }

    /**
     * Get media ready state
     */
    getReadyState(): Cypress.Chainable<number> {
      return this.mediaElement.then(($media) => {
        const mediaElement = $media[0] as HTMLMediaElement;
        return mediaElement.readyState;
      });
    }

    /**
     * Check if media is paused
     */
    isPaused(): Cypress.Chainable<boolean> {
      return this.mediaElement.then(($media) => {
        const mediaElement = $media[0] as HTMLMediaElement;
        return mediaElement.paused;
      });
    }
  };
}
