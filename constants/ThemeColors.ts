import { Brain, Compass, Star, Target, Trophy } from 'phosphor-react-native';

export interface ThemeConfig {
  colors: string[];
  icon: React.ComponentType<any>;
}

export const themeConfigs: Record<string, ThemeConfig> = {
  'Core Systems': {
    colors: ['#2a2a2a'],
    icon: Brain,
  },
  'Tactical Actions': {
    colors: ['#0a0a0a'],
    icon: Target,
  },
  'Environment Packs': {
    colors: ['#1f1f1f'],
    icon: Compass,
  },
  'Elite Performance Arcs': {
    colors: ['#151515'],
    icon: Star,
  },
  'default': {
    colors: ['#6c757d',],
    icon: Trophy,
  },
};

export const getThemeConfig = (themeName?: string): ThemeConfig => {
  if (!themeName || !themeConfigs[themeName]) {
    return themeConfigs['default'];
  }
  return themeConfigs[themeName];
}; 