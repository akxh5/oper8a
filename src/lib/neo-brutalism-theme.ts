/**
 * Neo-Brutalism Theme Configuration
 * Bold, high-contrast colors and design tokens for the neo-brutalism aesthetic
 */

export const neoBrutalismColors = {
  // Primary: Bold, saturated colors
  primary: {
    red: '#FF4F4F',      // Bright red
    orange: '#FF8C42',    // Bold orange  
    yellow: '#FFD23F',    // Vibrant yellow
    green: '#4ECDC4',     // Mint green
    blue: '#45B7D1',      // Electric blue
    purple: '#6C5CE7',    // Bold purple
    pink: '#FD79A8',      // Hot pink
  },
  
  // Secondary: Raw, unrefined tones
  secondary: {
    concrete: '#95A5A6',  // Raw concrete
    steel: '#7F8C8D',     // Industrial steel
    charcoal: '#2D3436',  // Dark charcoal
    cream: '#F8F9FA',     // Off-white cream
    beige: '#E8E8E8',     // Raw beige
  },
  
  // Accent: High-contrast, vibrant highlights
  accent: {
    lime: '#00FF87',      // Electric lime
    cyan: '#00FFFF',      // Pure cyan
    magenta: '#FF00FF',   // Pure magenta
    black: '#000000',     // Pure black
    white: '#FFFFFF',     // Pure white
  },
  
  // Background: Mix of white space and bold color blocks
  background: {
    light: '#FFFFFF',     // Clean white
    dark: '#1A1A1A',      // Deep black
    surface: '#F5F5F5',   // Light gray
    contrast: '#000000',  // Pure black contrast
  }
};

export const neoBrutalismShadows = {
  small: '2px 2px 0px #000000',
  medium: '4px 4px 0px #000000', 
  large: '6px 6px 0px #000000',
  xl: '8px 8px 0px #000000',
  xxl: '12px 12px 0px #000000',
  colored: {
    red: '4px 4px 0px #FF4F4F',
    blue: '4px 4px 0px #45B7D1',
    green: '4px 4px 0px #4ECDC4',
    yellow: '4px 4px 0px #FFD23F',
    purple: '4px 4px 0px #6C5CE7',
  }
};

export const neoBrutalismBorders = {
  thin: '2px solid #000000',
  medium: '3px solid #000000',
  thick: '4px solid #000000',
  chunky: '6px solid #000000',
  colored: {
    red: '3px solid #FF4F4F',
    blue: '3px solid #45B7D1', 
    green: '3px solid #4ECDC4',
    yellow: '3px solid #FFD23F',
    purple: '3px solid #6C5CE7',
  }
};

export const neoBrutalismTransforms = {
  tiltLeft: 'rotate(-2deg)',
  tiltRight: 'rotate(2deg)',
  tiltLeftMedium: 'rotate(-4deg)',
  tiltRightMedium: 'rotate(4deg)',
  tiltLeftLarge: 'rotate(-6deg)',
  tiltRightLarge: 'rotate(6deg)',
};

export const neoBrutalismTypography = {
  fontWeight: {
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  }
};