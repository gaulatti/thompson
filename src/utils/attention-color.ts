import type { BleeckerColorScheme } from '@gaulatti/bleecker/tokens';
import type { ViewStyle } from 'react-native';

export interface AttentionColorOptions {
  /** The category or column hue, expressed as a hue angle. */
  hue: number;
  /** Semantic urgency on a continuous 0-10 scale. */
  intensity: number;
  /** Native theme used to choose an accessible surface treatment. */
  colorScheme?: BleeckerColorScheme;
}

export interface AttentionColorResult {
  /** The mixed category-to-danger color used for markers and labels. */
  accent: string;
  /** Percentage of the conceptual surface traversed by the treatment. */
  coverage: number;
  /** Clamped 0-10 intensity. */
  intensity: number;
  /** Percentage of red in the accent color. */
  redMix: number;
  /** Ready-to-apply native surface styles. */
  style: ViewStyle;
  /** Surface color for a pressed interactive state. */
  pressedColor: string;
}

interface Rgb {
  blue: number;
  green: number;
  red: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function hslToRgb(hue: number, saturation: number, lightness: number): Rgb {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const segment = hue / 60;
  const secondary = chroma * (1 - Math.abs((segment % 2) - 1));
  const [red, green, blue] = segment < 1 ? [chroma, secondary, 0]
    : segment < 2 ? [secondary, chroma, 0]
      : segment < 3 ? [0, chroma, secondary]
        : segment < 4 ? [0, secondary, chroma]
          : segment < 5 ? [secondary, 0, chroma]
            : [chroma, 0, secondary];
  const match = lightness - chroma / 2;
  return { red: (red + match) * 255, green: (green + match) * 255, blue: (blue + match) * 255 };
}

function mix(from: Rgb, to: Rgb, amount: number): Rgb {
  return {
    red: from.red + (to.red - from.red) * amount,
    green: from.green + (to.green - from.green) * amount,
    blue: from.blue + (to.blue - from.blue) * amount
  };
}

function hex(color: Rgb): string {
  return `#${[color.red, color.green, color.blue]
    .map((channel) => Math.round(clamp(channel, 0, 255)).toString(16).padStart(2, '0'))
    .join('')}`;
}

/**
 * Builds a deterministic calm-to-urgent native treatment without erasing the
 * category hue. The mix and coverage formulas intentionally match Bleecker;
 * native surfaces receive concrete colors because React Native cannot render
 * CSS color-mix gradients.
 */
export function createAttentionColor({ colorScheme = 'light', hue, intensity: rawIntensity }: AttentionColorOptions): AttentionColorResult {
  const normalizedHue = ((Math.round(Number.isFinite(hue) ? hue : 210) % 360) + 360) % 360;
  const intensity = clamp(Number.isFinite(rawIntensity) ? rawIntensity : 0, 0, 10);
  const redMix = Math.round(intensity * 10);
  const coverage = 24 + intensity * 7.2;
  const category = hslToRgb(normalizedHue, 0.66, 0.52);
  const danger = hslToRgb(6, 0.78, 0.56);
  const accentRgb = mix(category, danger, redMix / 100);
  const base = colorScheme === 'dark' ? hslToRgb(207, 0.31, 0.12) : hslToRgb(36, 0.26, 0.965);
  const surfaceMix = (10 + intensity * 3.2) / 100;
  const pressedMix = Math.min(0.5, surfaceMix + 0.08);

  return {
    accent: hex(accentRgb),
    coverage,
    intensity,
    redMix,
    style: {
      backgroundColor: hex(mix(base, accentRgb, surfaceMix)),
      borderColor: hex(mix(base, accentRgb, Math.min(0.72, 0.34 + intensity * 0.025))),
      borderWidth: 1
    },
    pressedColor: hex(mix(base, accentRgb, pressedMix))
  };
}
