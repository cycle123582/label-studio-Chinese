import { useCallback, useRef, useEffect } from "react";
import { SYNC_WINDOW } from "../mixins/Syncable";

export const useUpdateBuffering = (
  mediaRef: React.RefObject<HTMLMediaElement> | React.MutableRefObject<HTMLMediaElement | undefined>,
  onBufferingChange: (isBuffering: boolean) => void,
) => {
  const timeoutRef = useRef<number | null>(null);
  const bufferingStartedTime = useRef<number | null>(null);

  const updateBuffering = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const mediaEl = mediaRef.current;
    if (!mediaEl) return;

    const shouldWaitForSyncWindow =
      bufferingStartedTime.current !== null && Date.now() - bufferingStartedTime.current < SYNC_WINDOW;
    const isBuffering = mediaEl.networkState === mediaEl.NETWORK_LOADING || shouldWaitForSyncWindow;

    if (isBuffering) {
      onBufferingChange(true);
      bufferingStartedTime.current = bufferingStartedTime.current ?? Date.now();
      timeoutRef.current = window.setTimeout(updateBuffering, 16);
    } else {
      onBufferingChange(false);
    }
  }, [mediaRef, onBufferingChange]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return updateBuffering;
};
