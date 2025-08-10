/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

// Standardized color palette for the entire app
export const Colors = {
  // Light theme (for backward compatibility)
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  
  // Dark theme (for backward compatibility)
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  
  // Standardized color palette for the entire app
  background: {
    primary: '#070708',      // Main app background
    secondary: '#2C2D30',    // Card backgrounds
    tertiary: '#1a1a1a',     // Darker backgrounds (deprecated, use secondary)
  },
  
  // Border colors
  border: {
    primary: '#3C3D40',      // Standard card borders
    secondary: '#333',        // Darker borders (deprecated, use primary)
    accent: '#2a2a2a',       // Accent borders
  },
  
  // Text colors
  text: {
    primary: '#fff',          // Primary text
    secondary: '#aaa',        // Secondary text
    tertiary: '#666',         // Tertiary text
    accent: '#007bff',        // Accent text (links, buttons)
  },
  
  // Button colors
  button: {
    primary: '#4A6B99',       // Primary button background
    secondary: '#3C3D40',     // Secondary button background
    danger: '#6B4A4A',        // Danger/cancel button background
    success: '#22c55e',       // Success button background
  },
  
  // Input colors
  input: {
    background: '#2C2D30',    // Input field background
    border: '#3C3D40',        // Input field border
    disabled: '#1C1F29',      // Disabled input background
    disabledText: '#666',     // Disabled input text
  },
  
  // Status colors
  status: {
    success: '#22c55e',       // Success states
    error: '#ef4444',         // Error states
    warning: '#f59e0b',       // Warning states
    info: '#3b82f6',         // Info states
  },
  
  // Overlay colors
  overlay: {
    dark: 'rgba(0, 0, 0, 0.7)',  // Dark overlays
    light: 'rgba(255, 255, 255, 0.05)', // Light overlays
  },
} as const;

// Legacy color exports for backward compatibility
export const {
  light,
  dark,
  background,
  border,
  text,
  button,
  input,
  status,
  overlay,
} = Colors;
