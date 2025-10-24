/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Tailwind palette (kept in sync with tailwind.config.js)
export const Palette = {
  primary: {
    DEFAULT: '#D65E48',
    50: '#FFF4F1',
    100: '#FFE6E0',
    200: '#F9CFC6',
    300: '#F2B1A3',
    400: '#E98E7E',
    500: '#E2725B',
    600: '#D65E48',
    700: '#C4513E',
    800: '#A24436',
    900: '#7F362C',
    950: '#5A241E',
  },
  secondary: {
    DEFAULT: '#8B0D19',
    50: '#FFF5F6',
    100: '#FFE7EA',
    200: '#FFC9D0',
    300: '#F59AA6',
    400: '#DE6B7B',
    500: '#B94A5D',
    600: '#8B0D19',
    700: '#730914',
    800: '#5A0710',
    900: '#42040B',
    950: '#2B0207',
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

const tintColorLight = Palette.primary[600];
const tintColorDark = '#ffffff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: Palette.gray[500],
    tabIconDefault: Palette.gray[500],
    tabIconSelected: tintColorLight,
    primary: Palette.primary.DEFAULT,
    secondary: Palette.secondary.DEFAULT,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: Palette.primary[400],
    secondary: Palette.secondary[400],
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
