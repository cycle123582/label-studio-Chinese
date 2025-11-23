import type { MediaView, ViewWithMedia } from "@humansignal/frontend-test/helpers/utils/media/types";

type SyncableView = MediaView & ViewWithMedia;

class SyncGroup {
  views: SyncableView[];
  constructor(views: SyncableView[]) {
    this.views = views;
  }

  checkSynchronization(tolerance = 0.01, maxShiftAlias: string | null = null, attempts = 5) {
    const mediaChains = this.views.map((view) => view.mediaElement);

    mediaChains[0].then((baseMedia) => {
      mediaChains.slice(1).forEach((mediaChain, idx) => {
        mediaChain.then((media) => {
          const baseMediaElement = baseMedia[0] as HTMLMediaElement;
          const mediaElement = media[0] as HTMLMediaElement;
          const tag1 = `${baseMediaElement.tagName}#${0}`;
          const tag2 = `${mediaElement.tagName}#${idx + 1}`;

          const check = () => {
            try {
              expect(baseMediaElement.paused).to.equal(
                mediaElement.paused,
                `Compare paused state  for ${tag2} and ${tag1}`,
              );
              expect(baseMediaElement.currentTime).closeTo(
                mediaElement.currentTime,
                tolerance,
                `Compare currentTime for ${tag2} and ${tag1}`,
              );
              if (maxShiftAlias) {
                cy.get(`@${maxShiftAlias}`)
                  .then((maxShift: number) => {
                    const currentShift = Math.abs(mediaElement.currentTime - baseMediaElement.currentTime);
                    maxShift = Math.max(maxShift, currentShift);
                    return maxShift;
                  })
                  .as(maxShiftAlias);
              }
            } catch (e) {
              if (attempts > 1) {
                // The other case is when syncronisatiom check happens in the middle of play/pause batch
                // In that case we just need to recheck it 1 or 2 times (in good case it takes 1ms)
                cy.wait(200).then(() => {
                  attempts--;
                  check();
                });
              } else {
                throw new Error(`Synchronization check failed after multiple attempts: ${e}`);
              }
            }
          };
          check();
        });
      });
    });
  }
}

export const useSyncGroup = (views: SyncableView[]) => {
  return new SyncGroup(views);
};
