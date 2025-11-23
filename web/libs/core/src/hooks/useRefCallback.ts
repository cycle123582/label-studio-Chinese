import { useValueRef } from "@humansignal/core/hooks/useValueRef";
import { useCallback } from "react";

export function useRefCallback<T extends (...args: any[]) => any>(callback: T) {
  const ref = useValueRef<T>(callback);

  return useCallback((...args: Parameters<T>): ReturnType<T> => {
    return ref.current(...args);
  }, []);
}
