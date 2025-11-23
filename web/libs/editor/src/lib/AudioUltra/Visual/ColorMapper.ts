import colormap from "colormap";
import { clamp } from "../Common/Utils";

// Define known color schemes
export const COLOR_SCHEMES = {
  JET: "jet",
  HSV: "hsv",
  HOT: "hot",
  COOL: "cool",
  SPRING: "spring",
  SUMMER: "summer",
  AUTUMN: "autumn",
  WINTER: "winter",
  BONE: "bone",
  COPPER: "copper",
  GREYS: "greys",
  YIGNBU: "YIGnBu",
  GREENS: "greens",
  YIORRD: "YIOrRd",
  BLUERED: "bluered",
  RDBU: "RdBu",
  PICNIC: "picnic",
  RAINBOW: "rainbow",
  PORTLAND: "portland",
  BLACKBODY: "blackbody",
  EARTH: "earth",
  ELECTRIC: "electric",
  VIRIDIS: "viridis",
  INFERNO: "inferno",
  MAGMA: "magma",
  PLASMA: "plasma",
  WARM: "warm",
  RAINBOW_SOFT: "rainbow-soft",
  BATHYMETRY: "bathymetry",
  CDOM: "cdom",
  CHLOROPHYLL: "chlorophyll",
  DENSITY: "density",
  FREESURFACE_BLUE: "freesurface-blue",
  FREESURFACE_RED: "freesurface-red",
  OXYGEN: "oxygen",
  PAR: "par",
  PHASE: "phase",
  SALINITY: "salinity",
  TEMPERATURE: "temperature",
  TURBIDITY: "turbidity",
  VELOCITY_BLUE: "velocity-blue",
  VELOCITY_GREEN: "velocity-green",
  CUBEHELIX: "cubehelix",
} as const;

export type ColorScheme = (typeof COLOR_SCHEMES)[keyof typeof COLOR_SCHEMES];

// Define the number of shades for cached colormaps
const COLORMAP_SHADES = 512;

export class ColorMapper {
  private activeColormap: number[][] = [];
  private currentScheme: ColorScheme;

  constructor(initialScheme: ColorScheme = COLOR_SCHEMES.VIRIDIS) {
    this.currentScheme = initialScheme;
    this.cacheColormap();
  }

  /**
   * Update the color scheme and regenerate the cache
   */
  public setColorScheme(schemeName: ColorScheme): void {
    if (this.currentScheme !== schemeName) {
      this.currentScheme = schemeName;
      this.cacheColormap();
    }
  }

  /**
   * Convert normalized value (0-1) to color using the cached colormap
   */
  public magnitudeToColor(normalizedValue: number): string {
    const m = clamp(normalizedValue, 0, 1);
    const map = this.activeColormap;

    if (!map || map.length === 0) {
      // Fallback if cache is somehow empty
      const v = Math.round(m * 255);
      return `rgba(${v}, ${v}, ${v}, 1)`;
    }

    // Find the closest color index in the cached map
    const index = Math.min(Math.floor(m * map.length), map.length - 1);
    const c = map[index];

    if (!c || c.length < 3) {
      // Fallback if color data is invalid
      const v = Math.round(m * 255);
      return `rgba(${v}, ${v}, ${v}, 1)`;
    }

    const r = c[0];
    const g = c[1];
    const b = c[2];

    // Convert to rgba string
    return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, 1)`;
  }

  /**
   * Generate and cache the color array for the current scheme
   */
  private cacheColormap(): void {
    try {
      this.activeColormap = colormap({
        colormap: this.currentScheme,
        nshades: COLORMAP_SHADES,
        format: "float",
      });
      console.log(`ColorMapper: Cached colormap '${this.currentScheme}' with ${this.activeColormap.length} shades.`);
    } catch (error) {
      console.error(`Failed to generate colormap '${this.currentScheme}':`, error);
      // Fallback to a simple grayscale cache
      this.activeColormap = Array.from({ length: COLORMAP_SHADES }, (_, i) => {
        const v = i / (COLORMAP_SHADES - 1);
        return [v, v, v];
      });
      // Reset to a known good scheme
      this.currentScheme = COLOR_SCHEMES.VIRIDIS;
      this.cacheColormap(); // Re-cache viridis as fallback
    }
  }
}
