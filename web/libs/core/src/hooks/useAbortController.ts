import { useCallback, useEffect, useMemo, useRef } from "react";

export interface AbortControllerHook {
  controller: React.MutableRefObject<AbortController>;
  renew: () => void;
  abort: () => void;
}

/**
 * Creates a shared AbortController, which can be used to abort requests.
 * Automatically cancels the current controller when the component unmounts.
 */
export const useAbortController = () => {
  const controller = useRef(new AbortController());

  const abort = useCallback(() => {
    const ctrl = controller.current;
    if (ctrl.signal.aborted) return;

    ctrl.abort();
  }, []);

  useEffect(() => {
    return () => {
      abort();
    };
  }, [abort]);

  const renew = useCallback(() => {
    abort();
    controller.current = new AbortController();
  }, [abort]);

  const abortController: AbortControllerHook = useMemo(
    () => ({
      controller,
      renew,
      abort,
    }),
    [controller, renew, abort],
  );

  return abortController;
};
