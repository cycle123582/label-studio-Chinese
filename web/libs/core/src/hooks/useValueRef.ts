import { useRef } from "react";

export function useValueRef<T>(value: T) {
  const ref = useRef<T>(value);
  ref.current = value;
  return ref;
}
