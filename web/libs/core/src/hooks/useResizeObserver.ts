import { useCallback, useEffect, useRef, useState } from "react";

export interface ResizeObserverSize {
  width?: number;
  height?: number;
}

export interface UseResizeObserverOptions<T extends ResizeObserverSize = ResizeObserverSize> {
  /**
   * Function to extract size data from ResizeObserver entries
   * Default: returns the size of the first element
   */
  extractSize?: (elements: Element[], entries: ResizeObserverEntry[]) => T;
  /**
   * Debounce time in milliseconds to prevent excessive updates
   * Default: 16ms (roughly 60fps)
   */
  debounceMs?: number;
  defaultSize?: T;
}

export type ElementsOption = Element | Element[];

const DEFAULT_DEBOUNCE_MS = 16;

const defaultExtractSizeOneElement = <T extends ResizeObserverSize = ResizeObserverSize>(
  _elements: Element[],
  entries: ResizeObserverEntry[],
): T => {
  const { width, height } = entries[0].contentRect;
  return { width, height } as T;
};

const defaultExtractSizeMultipleElements = <T extends ResizeObserverSize = ResizeObserverSize>(
  elements: Element[],
  entries: ResizeObserverEntry[],
): T => {
  if (entries.length === 0) return {} as T;
  const { width, height } = elements[0].getBoundingClientRect();
  return { width, height } as T;
};

/**
 * Hook for observing resize changes on elements
 * Prevents "ResizeObserver loop limit exceeded" errors through debouncing
 *
 * @param elements - Element or array of elements to observe
 * @param options - Configuration options
 * @returns Current size data that triggers re-renders
 */
export function useResizeObserver<T extends ResizeObserverSize = ResizeObserverSize>(
  elements: ElementsOption,
  options: UseResizeObserverOptions<T> = {},
): T {
  const elementsArray = Array.isArray(elements) ? elements : [elements];
  const {
    extractSize = elementsArray.length === 1 ? defaultExtractSizeOneElement : defaultExtractSizeMultipleElements,
    debounceMs = DEFAULT_DEBOUNCE_MS,
  } = options;

  const [size, setSize] = useState<T>({} as T);
  const observerRef = useRef<ResizeObserver | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const elementsRef = useRef<Element[] | null>(null);

  // Memoized callback to handle resize events
  const handleResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      // Clear any existing timeout and animation frame to debounce rapid changes
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Use requestAnimationFrame + setTimeout to prevent loop limit exceeded errors
      timeoutRef.current = window.setTimeout(() => {
        rafRef.current = requestAnimationFrame(() => {
          try {
            const newSize = extractSize(elementsRef.current as Element[], entries);
            setSize((prevSize) => {
              if (prevSize === newSize) return prevSize;
              if (JSON.stringify(prevSize) !== JSON.stringify(newSize)) {
                return newSize;
              }
              return prevSize;
            });
          } catch (error) {
            console.warn("Error in resize observer callback: ", error);
          }
          rafRef.current = null;
        });
        timeoutRef.current = null;
      }, debounceMs);
    },
    [extractSize, debounceMs],
  );

  // Effect to set up and clean up the ResizeObserver
  useEffect(() => {
    const elementsArray = Array.isArray(elements) ? elements : [elements];

    if (elementsArray.length === 0) {
      setSize({} as T);
      return;
    }

    // Create new ResizeObserver
    observerRef.current = new ResizeObserver(handleResize);

    // Observe all elements
    elementsArray.forEach((element) => {
      observerRef.current?.observe(element);
    });

    // Store current elements reference for cleanup comparison
    elementsRef.current = elementsArray;

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [elements, handleResize]);

  return size ?? ({} as T);
}
