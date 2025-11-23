import { type MutableRefObject, useCallback, useContext, useEffect } from "react";
import { TimelineContext } from "../../../components/Timeline/Context";
import type { Waveform } from "../Waveform";
import type { WindowFunctionType } from "../Visual/WindowFunctions";
import type { ColorScheme } from "../Visual/ColorMapper";
import type { SpectrogramScale } from "../Analysis/FFTProcessor";
import { SPECTROGRAM_DEFAULTS } from "../Visual/constants";

interface SpectrogramParameters {
  fftSamples: number;
  melBands: number;
  windowingFunction: WindowFunctionType;
  colorScheme: ColorScheme;
  minDb: number;
  maxDb: number;
}

type PartialSpectrogramParameters = Partial<SpectrogramParameters> & {
  scale?: SpectrogramScale;
};

interface SpectrogramControls {
  setFftSamples: (samples: number) => void;
  setMelBands: (bands: number) => void;
  setWindowingFunction: (func: WindowFunctionType) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  setDbRange: (minDb: number, maxDb: number) => void;
  setScale: (scale: SpectrogramScale) => void;
}

/**
 * Hook to manage and synchronize spectrogram settings between
 * the TimelineContext and the Waveform instance.
 */
export function useSpectrogramControls(waveform: MutableRefObject<Waveform | undefined>): SpectrogramControls {
  const { settings, changeSetting } = useContext(TimelineContext);

  // Effect to update Waveform/Visualizer when context settings change
  useEffect(() => {
    if (!waveform.current || !settings) return;

    const wf = waveform.current;
    const paramsToUpdate: PartialSpectrogramParameters = {};

    if (settings.spectrogramFftSamples !== undefined) {
      paramsToUpdate.fftSamples = settings.spectrogramFftSamples;
    }
    if (settings.numberOfMelBands !== undefined) {
      paramsToUpdate.melBands = settings.numberOfMelBands;
    }
    if (settings.spectrogramWindowingFunction) {
      paramsToUpdate.windowingFunction = settings.spectrogramWindowingFunction as WindowFunctionType;
    }
    if (settings.spectrogramColorScheme) {
      paramsToUpdate.colorScheme = settings.spectrogramColorScheme as ColorScheme;
    }
    if (settings.spectrogramMinDb !== undefined) {
      paramsToUpdate.minDb = settings.spectrogramMinDb;
    }
    if (settings.spectrogramMaxDb !== undefined) {
      paramsToUpdate.maxDb = settings.spectrogramMaxDb;
    }
    if (settings.spectrogramScale) {
      paramsToUpdate.scale = settings.spectrogramScale;
    }

    if (Object.keys(paramsToUpdate).length > 0) {
      wf.updateSpectrogramConfig(paramsToUpdate);
    }
  }, [
    settings?.spectrogramFftSamples,
    settings?.numberOfMelBands,
    settings?.spectrogramWindowingFunction,
    settings?.spectrogramColorScheme,
    settings?.spectrogramMinDb,
    settings?.spectrogramMaxDb,
    settings?.spectrogramScale,
    waveform,
  ]);

  const setFftSamples = useCallback(
    (samples: number) => {
      if (!waveform.current) return;

      if (samples < SPECTROGRAM_DEFAULTS.FFT_SAMPLES / 8 || samples > SPECTROGRAM_DEFAULTS.FFT_SAMPLES * 4) {
        console.warn(`Invalid FFT samples value: ${samples}`);
        return;
      }

      waveform.current.updateSpectrogramConfig({ fftSamples: samples });
      changeSetting?.("spectrogramFftSamples", samples);
    },
    [waveform, changeSetting],
  );

  const setMelBands = useCallback(
    (bands: number) => {
      if (!waveform.current) return;

      if (bands < 1 || bands > 512) {
        console.warn(`Invalid mel bands value: ${bands}`);
        return;
      }

      waveform.current.updateSpectrogramConfig({ melBands: bands });
      changeSetting?.("numberOfMelBands", bands);
    },
    [waveform, changeSetting],
  );

  const setWindowingFunction = useCallback(
    (func: WindowFunctionType) => {
      if (!waveform.current) return;

      waveform.current.updateSpectrogramConfig({ windowingFunction: func });
      changeSetting?.("spectrogramWindowingFunction", func);
    },
    [waveform, changeSetting],
  );

  const setColorScheme = useCallback(
    (scheme: ColorScheme) => {
      if (!waveform.current) return;

      waveform.current.updateSpectrogramConfig({ colorScheme: scheme });
      changeSetting?.("spectrogramColorScheme", scheme);
    },
    [waveform, changeSetting],
  );

  const setDbRange = useCallback(
    (minDb: number, maxDb: number) => {
      if (!waveform.current) return;

      if (minDb >= maxDb) {
        console.warn(`Invalid dB range: min (${minDb}) must be less than max (${maxDb})`);
        return;
      }

      waveform.current.updateSpectrogramConfig({ minDb, maxDb });
      changeSetting?.("spectrogramMinDb", minDb);
      changeSetting?.("spectrogramMaxDb", maxDb);
    },
    [waveform, changeSetting],
  );

  const setScale = useCallback(
    (scale: SpectrogramScale) => {
      if (!waveform.current) return;

      if (!["linear", "log", "mel"].includes(scale)) {
        console.warn(`Invalid spectrogram scale: ${scale}`);
        return;
      }

      waveform.current.updateSpectrogramConfig({ scale });
      changeSetting?.("spectrogramScale", scale);
    },
    [waveform, changeSetting],
  );

  return {
    setFftSamples,
    setMelBands,
    setWindowingFunction,
    setColorScheme,
    setDbRange,
    setScale,
  };
}
