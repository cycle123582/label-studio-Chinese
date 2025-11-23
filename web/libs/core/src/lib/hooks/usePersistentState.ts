import { useCallback, useMemo, useState } from "react";

type ValueDecode<T> = (value: string, defaultValue: T) => T;

type ValueEncode<T> = (value: T) => string;

type Options<T> = {
  decoder?: ValueDecode<T>;
  encoder?: ValueEncode<T>;
};

type NextState<T> = T | ((x: T) => T);
type StateResult<T> = [T, (value: NextState<T>) => void];

/**
 * Analogous to useState, but persists the state to localStorage
 * @param key {string} - The key to use for localStorage
 * @param defaultValue {T} - The default value to use if the key is not set
 * @param options {Options<T>} - Optional decoder and encoder functions
 * @returns {StateResult<T>} - A tuple containing the current state and a function to update it, the same as useState
 */
export const usePersistentState = <T>(key: string, defaultValue: T, options: Options<T> = {}): StateResult<T> => {
  const { decoder, encoder } = options;
  const initialState: T = useMemo(() => {
    const localStorageValue = localStorage.getItem(key);

    return typeof localStorageValue === "string"
      ? (decoder?.(localStorageValue, defaultValue) ?? (localStorageValue as T))
      : defaultValue;
  }, []);
  const [value, setValue] = useState<T>(initialState);
  const setPersistentValue = useCallback((value: NextState<T>) => {
    setValue((prevValue: T) => {
      const newValue = value instanceof Function ? value(prevValue) : value;
      const convertedValue = encoder?.(newValue) ?? (newValue as any).toString();

      localStorage.setItem(key, convertedValue);
      return newValue;
    });
  }, []);

  return [value, setPersistentValue];
};

function jsonDecoder<T>(value: string, defaultValue: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return defaultValue;
  }
}

function jsonEncoder<T>(value: T): string {
  return JSON.stringify(value);
}

/**
 * Analogous to useState, but persists the state to localStorage as JSON
 * @param key {string} - The key to use for localStorage
 * @param defaultValue {T} - The default value to use if the key is not set
 * @returns {StateResult<T>} - A tuple containing the current state and a function to update it, the same as useState
 */
export const usePersistentJSONState = <T>(key: string, defaultValue: T): StateResult<T> => {
  return usePersistentState<T>(key, defaultValue, { decoder: jsonDecoder, encoder: jsonEncoder });
};
