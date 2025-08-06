export interface ArcColorScheme {
  background: string;
  border: string;
  tag: string;
  tagText: string;
}

export const arcColors: Record<string, ArcColorScheme> = {
  commit: {
    background: '#0C1117',
    border: '#1C2026',
    tag: '#1C2026',
    tagText: '#ffffff',
  },
  condition: {
    background: '#1A1D22',
    border: '#2A2E34',
    tag: '#2A2E34',
    tagText: '#ffffff',
  },
  control: {
    background: '#1E2A37',
    border: '#2F3E4C',
    tag: '#2F3E4C',
    tagText: '#ffffff',
  },
  reset: {
    background: '#300C0C',
    border: '#461F1F',
    tag: '#461F1F',
    tagText: '#ffffff',
  },
  prime: {
    background: '#2C1F35',
    border: '#3E2A48',
    tag: '#3E2A48',
    tagText: '#ffffff',
  },
  explore: {
    background: '#0F0F0F',
    border: '#1A1A1A',
    tag: '#1A1A1A',
    tagText: '#ffffff',
  },
  optimise: {
    background: '#191C1F',
    border: '#2A2D31',
    tag: '#2A2D31',
    tagText: '#ffffff',
  },
  repeat: {
    background: '#212426',
    border: '#2E3134',
    tag: '#2E3134',
    tagText: '#ffffff',
  },
};

export const getArcColorScheme = (arcName: string): ArcColorScheme => {
  const normalizedName = arcName.toLowerCase();
  return arcColors[normalizedName] || arcColors.explore; // fallback to explore colors
}; 