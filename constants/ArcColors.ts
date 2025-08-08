export interface ArcColorScheme {
  background: string;
  border: string;
  tag: string;
  tagText: string;
}

export const arcColors: Record<string, ArcColorScheme> = {
  commit: {
    background: '#2C2D30',
    border: '#3C3D40',
    tag: '#347488',
    tagText: '#ffffff',
  },
  condition: {
    background: '#2C2D30',
    border: '#3C3D40',
    tag: '#388169',
    tagText: '#ffffff',
  },
  control: {
    background: '#2C2D30',
    border: '#3C3D40',
    tag: '#3B487D',
    tagText: '#ffffff',
  },
  reset: {
    background: '#2C2D30',
    border: '#3C3D40',
    tag: '#588137',
    tagText: '#ffffff',
  },
  prime: {
    background: '#2C2D30',
    border: '#3C3D40',
    tag: '#604B9F',
    tagText: '#ffffff',
  },
  explore: {
    background: '#2C2D30',
    border: '#3C3D40',
    tag: '#8F773F',
    tagText: '#ffffff',
  },
  optimise: {
    background: '#2C2D30',
    border: '#3C3D40',
    tag: '#975B3E',
    tagText: '#ffffff',
  },
  repeat: {
    background: '#2C2D30',
    border: '#3C3D40',
    tag: '#9FA248',
    tagText: '#ffffff',
  },
};

export const getArcColorScheme = (arcName: string): ArcColorScheme => {
  const normalizedName = arcName.toLowerCase();
  return arcColors[normalizedName] || arcColors.explore; // fallback to explore colors
}; 