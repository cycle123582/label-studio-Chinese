interface PatchedHTMLMediaElement extends HTMLMediaElement {
  _playPausePatched?: boolean;
}

type PatchableMethod = "play" | "pause";
const PATCHABLE_METHODS: PatchableMethod[] = ["play", "pause"];

/*
 * This patch prevents unhandled promise rejections in development mode
 * it will help in development with alerts that interrupt the flow
 * it will help in production with errors in the console
 * there is no option for just queuing the play/pause methods as it would cause issues (@see "Seeking is synced between audio, video when interacting with audio interface" test scenario)
 */
export function patchPlayPauseMethods<T extends HTMLMediaElement>(element: T): T & PatchedHTMLMediaElement {
  if (!(element instanceof HTMLMediaElement)) {
    throw new TypeError("patchPlayPauseMethods expects <audio> | <video>");
  }

  const patchedElement = element as T & PatchedHTMLMediaElement;

  if (patchedElement._playPausePatched) {
    return patchedElement;
  }

  const wrapMethod = <M extends PatchableMethod>(methodName: M) => {
    const originalMethod = patchedElement[methodName].bind(patchedElement);
    patchedElement[methodName] = (() => {
      let res = originalMethod();
      if (res instanceof Promise) {
        res = res.catch(() => {}); // catch any errors to avoid unhandled promise rejections
      }
      return res as ReturnType<(typeof patchedElement)[M]>;
    }) as unknown as (typeof patchedElement)[M];
  };

  PATCHABLE_METHODS.forEach(wrapMethod);
  patchedElement._playPausePatched = true;

  return patchedElement;
}
