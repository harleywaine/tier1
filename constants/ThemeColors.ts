import { Brain, Compass, Star, Target, Trophy } from 'phosphor-react-native';

export interface ThemeConfig {
  colors: string[];
  icon: React.ComponentType<any>;
}

export const themeConfigs: Record<string, ThemeConfig> = {
  'Core Systems': {
    colors: ['#0a2e28'],
    icon: Brain,
  },
  'Tactical Actions': {
    colors: ['#3d2e16'],
    icon: Target,
  },
  'Environment Packs': {
    colors: ['#111a28'],
    icon: Compass,
  },
  'Elite Performance Arcs': {
    colors: ['#4a2516'],
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