/**
 * Handles the creation and application of Mel filter banks for audio analysis.
 */
export class MelBanks {
  private filterbank: number[][];
  private numBands: number;

  /**
   * Initializes the MelBanks instance and creates the filterbank.
   *
   * @param sampleRate - The sample rate of the audio.
   * @param linearBinCount - The number of frequency bins in the linear spectrum (fftSize / 2 + 1).
   * @param numBands - The desired number of Mel bands.
   */
  constructor(sampleRate: number, linearBinCount: number, numBands: number) {
    if (numBands <= 0) {
      console.warn("Number of Mel bands must be positive.");
      // Provide a default empty filterbank to avoid errors later
      this.filterbank = [];
      this.numBands = 0;
    } else {
      this.numBands = numBands;
      this.filterbank = this.createMelFilterbank(sampleRate, linearBinCount, numBands);
    }
  }

  /**
   * Applies the pre-calculated Mel filter bank to a linear power spectrum.
   *
   * @param linearSpectrum - The input linear power spectrum (magnitudes).
   * @returns The spectrum converted to the Mel scale.
   */
  applyFilterbank(linearSpectrum: Float32Array): Float32Array {
    if (this.filterbank.length === 0 || this.numBands === 0) {
      console.warn("Mel filter bank not initialized or invalid.");
      // Return an empty or zero-filled array matching the expected band count
      return new Float32Array(this.numBands).fill(0);
    }

    // Ensure the filter bank bin count matches linear spectrum length
    if (this.filterbank.length > 0 && this.filterbank[0].length !== linearSpectrum.length) {
      console.error(
        `Mel filter bank bin count (${this.filterbank[0].length}) does not match linear spectrum length (${linearSpectrum.length}). Recreate MelBanks instance.`,
      );
      return new Float32Array(this.numBands).fill(0);
    }

    const melSpectrum = new Float32Array(this.numBands).fill(0);
    for (let i = 0; i < this.numBands; i++) {
      const filter = this.filterbank[i];
      // filter bank[0].length should equal linearSpectrum.length due to check above
      for (let j = 0; j < filter.length; j++) {
        melSpectrum[i] += linearSpectrum[j] * filter[j];
      }
      // Add a small epsilon to avoid log(0) if further log scaling is applied later
      melSpectrum[i] = melSpectrum[i] > 0 ? melSpectrum[i] : 1e-10;
    }

    return melSpectrum;
  }

  /**
   * Converts frequency in Hz to Mel scale.
   */
  private hzToMel(hz: number): number {
    return 2595 * Math.log10(1 + hz / 700);
  }

  /**
   * Converts Mel scale value back to frequency in Hz.
   */
  private melToHz(mel: number): number {
    return 700 * (10 ** (mel / 2595) - 1);
  }

  /**
   * Creates a Mel filter bank matrix.
   */
  private createMelFilterbank(sampleRate: number, linearBinCount: number, numBands: number): number[][] {
    // Basic parameter validation
    if (numBands <= 0 || linearBinCount <= 1 || sampleRate <= 0) {
      console.warn("Invalid parameters for Mel filterbank creation.");
      return [];
    }

    const lowFreqMel = 0;
    const highFreqMel = this.hzToMel(sampleRate / 2);

    // Check for degenerate Mel range
    if (lowFreqMel >= highFreqMel) {
      console.warn("Min Mel frequency is not less than Max Mel frequency.");
      return [];
    }

    const melPoints = new Float32Array(numBands + 2);
    const melStep = (highFreqMel - lowFreqMel) / (numBands + 1);

    // Check for a non-positive Mel step
    if (melStep <= 0) {
      console.warn("Calculated Mel step is not positive.");
      return [];
    }

    // Create evenly spaced points in a Mel scale
    for (let i = 0; i < numBands + 2; i++) {
      melPoints[i] = lowFreqMel + i * melStep;
    }

    const hzPoints: Float32Array = melPoints.map((mel) => this.melToHz(mel));
    // Calculate the frequency resolution of the linear FFT bins
    const freqResolution: number = sampleRate / (2 * (linearBinCount - 1));
    const binFreqs: Float32Array = new Float32Array(linearBinCount).map((_, i) => i * freqResolution);

    const filterbank: number[][] = [];
    for (let i = 0; i < numBands; i++) {
      const filter = new Array(linearBinCount).fill(0);
      const leftHz = hzPoints[i];
      const centerHz = hzPoints[i + 1];
      const rightHz = hzPoints[i + 2];

      // Check for non-positive frequency steps which cause division by zero
      const leftDelta = centerHz - leftHz;
      const rightDelta = rightHz - centerHz;

      // Handle degenerate filters where the triangle collapses due to discretization
      if (leftDelta <= 0 || rightDelta <= 0) {
        // Visual Fix: Instead of a zero-energy filter (causing a dark line
        // in the spectrogram), assign a weight of 1.0 to the single FFT bin
        // closest to the center frequency. This passes the energy from that bin
        // through, avoiding the artifact, although it's not true Mel filtering
        // for this specific band.
        console.warn(
          `Degenerate filter shape detected for Mel band ${i} (center: ${centerHz.toFixed(
            2,
          )} Hz). Applying visual fix.`,
        );
        // Find the bin index closest to the center frequency
        const targetBinIndex = Math.round(centerHz / freqResolution);
        // Ensure the index is within bounds
        const clampedBinIndex = Math.max(0, Math.min(linearBinCount - 1, targetBinIndex));
        if (clampedBinIndex >= 0 && clampedBinIndex < linearBinCount) {
          filter[clampedBinIndex] = 1.0;
        }
        // No need to continue; push the filter with the single '1'
      } else {
        // Normal filter calculation for non-degenerate triangles
        for (let j = 0; j < linearBinCount; j++) {
          const freq = binFreqs[j];
          // Rising slope
          if (freq >= leftHz && freq <= centerHz) {
            filter[j] = (freq - leftHz) / leftDelta;
          }
          // Falling slope
          else if (freq > centerHz && freq <= rightHz) {
            filter[j] = (rightHz - freq) / rightDelta;
          }
        }
      }
      filterbank.push(filter);
    }
    return filterbank;
  }
}
