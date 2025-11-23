import { mapKonvaBrightness } from "../image";

describe("mapKonvaBrightness", () => {
  describe("linear range (0% - 100%)", () => {
    it.each([
      [0, -1],
      [25, -0.75],
      [50, -0.5],
      [75, -0.25],
      [100, 0],
    ])("maps %d%% brightness to %f", (input, expected) => {
      expect(mapKonvaBrightness(input)).toBeCloseTo(expected, 4);
    });
  });

  describe("non-linear range (100% - 400%)", () => {
    it.each([
      [150, Math.sqrt(50 / 300) * 0.8],
      [200, Math.sqrt(100 / 300) * 0.8],
      [250, Math.sqrt(150 / 300) * 0.8],
      [300, Math.sqrt(200 / 300) * 0.8],
      [350, Math.sqrt(250 / 300) * 0.8],
      [400, Math.sqrt(300 / 300) * 0.8], // = 0.8
    ])("maps %d%% brightness correctly", (input, expected) => {
      expect(mapKonvaBrightness(input)).toBeCloseTo(expected, 4);
    });
  });

  describe("general characteristics", () => {
    it("returns a finite number for a wide range of inputs", () => {
      for (let i = 0; i <= 400; i += 10) {
        const result = mapKonvaBrightness(i);
        expect(typeof result).toBe("number");
        expect(Number.isFinite(result)).toBe(true);
      }
    });

    it("returns 0 at exactly 100%", () => {
      expect(mapKonvaBrightness(100)).toBe(0);
    });

    it("returns maximum value 0.8 at 400%", () => {
      expect(mapKonvaBrightness(400)).toBeCloseTo(0.8, 4);
    });
  });
});
