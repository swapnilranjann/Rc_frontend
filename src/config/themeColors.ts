export interface ThemeColor {
  id: string;
  name: string;
  icon: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  gradient: string;
  primaryRgb: string; // RGB values for rgba() usage
}

// Helper function to convert hex to RGB
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
};

export const themeColors: ThemeColor[] = [
  {
    id: 'blue',
    name: 'Ocean Blue',
    icon: '🌊',
    primary: '#3b82f6',
    primaryDark: '#2563eb',
    primaryLight: '#60a5fa',
    secondary: '#1e40af',
    accent: '#93c5fd',
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    primaryRgb: hexToRgb('#3b82f6')
  },
  {
    id: 'orange',
    name: 'Sunset Orange',
    icon: '🔥',
    primary: '#ff9900',
    primaryDark: '#ff6b35',
    primaryLight: '#ffb347',
    secondary: '#e85d04',
    accent: '#ffc971',
    gradient: 'linear-gradient(135deg, #ff9900, #ff6b35)',
    primaryRgb: hexToRgb('#ff9900')
  },
  {
    id: 'green',
    name: 'Forest Green',
    icon: '🌲',
    primary: '#10b981',
    primaryDark: '#059669',
    primaryLight: '#34d399',
    secondary: '#047857',
    accent: '#6ee7b7',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    primaryRgb: hexToRgb('#10b981')
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    icon: '👑',
    primary: '#8b5cf6',
    primaryDark: '#7c3aed',
    primaryLight: '#a78bfa',
    secondary: '#6d28d9',
    accent: '#c4b5fd',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    primaryRgb: hexToRgb('#8b5cf6')
  },
  {
    id: 'red',
    name: 'Racing Red',
    icon: '🏁',
    primary: '#ef4444',
    primaryDark: '#dc2626',
    primaryLight: '#f87171',
    secondary: '#b91c1c',
    accent: '#fca5a5',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    primaryRgb: hexToRgb('#ef4444')
  },
  {
    id: 'pink',
    name: 'Cherry Pink',
    icon: '🌸',
    primary: '#ec4899',
    primaryDark: '#db2777',
    primaryLight: '#f472b6',
    secondary: '#be185d',
    accent: '#f9a8d4',
    gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
    primaryRgb: hexToRgb('#ec4899')
  },
  {
    id: 'teal',
    name: 'Ocean Teal',
    icon: '🌴',
    primary: '#14b8a6',
    primaryDark: '#0d9488',
    primaryLight: '#2dd4bf',
    secondary: '#0f766e',
    accent: '#5eead4',
    gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)',
    primaryRgb: hexToRgb('#14b8a6')
  },
  {
    id: 'indigo',
    name: 'Midnight Indigo',
    icon: '🌙',
    primary: '#6366f1',
    primaryDark: '#4f46e5',
    primaryLight: '#818cf8',
    secondary: '#4338ca',
    accent: '#a5b4fc',
    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    primaryRgb: hexToRgb('#6366f1')
  },
  {
    id: 'cyan',
    name: 'Electric Cyan',
    icon: '⚡',
    primary: '#06b6d4',
    primaryDark: '#0891b2',
    primaryLight: '#22d3ee',
    secondary: '#0e7490',
    accent: '#67e8f9',
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    primaryRgb: hexToRgb('#06b6d4')
  },
  {
    id: 'amber',
    name: 'Golden Amber',
    icon: '🌟',
    primary: '#f59e0b',
    primaryDark: '#d97706',
    primaryLight: '#fbbf24',
    secondary: '#b45309',
    accent: '#fcd34d',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    primaryRgb: hexToRgb('#f59e0b')
  },
  {
    id: 'lime',
    name: 'Neon Lime',
    icon: '🍋',
    primary: '#84cc16',
    primaryDark: '#65a30d',
    primaryLight: '#a3e635',
    secondary: '#4d7c0f',
    accent: '#bef264',
    gradient: 'linear-gradient(135deg, #84cc16, #65a30d)',
    primaryRgb: hexToRgb('#84cc16')
  },
  {
    id: 'rose',
    name: 'Romantic Rose',
    icon: '🌹',
    primary: '#f43f5e',
    primaryDark: '#e11d48',
    primaryLight: '#fb7185',
    secondary: '#be123c',
    accent: '#fda4af',
    gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)',
    primaryRgb: hexToRgb('#f43f5e')
  },
  {
    id: 'violet',
    name: 'Deep Violet',
    icon: '💜',
    primary: '#a855f7',
    primaryDark: '#9333ea',
    primaryLight: '#c084fc',
    secondary: '#7e22ce',
    accent: '#d8b4fe',
    gradient: 'linear-gradient(135deg, #a855f7, #9333ea)',
    primaryRgb: hexToRgb('#a855f7')
  },
  {
    id: 'emerald',
    name: 'Emerald Green',
    icon: '💎',
    primary: '#10b981',
    primaryDark: '#059669',
    primaryLight: '#34d399',
    secondary: '#047857',
    accent: '#6ee7b7',
    gradient: 'linear-gradient(135deg, #10b981, #047857)',
    primaryRgb: hexToRgb('#10b981')
  },
  {
    id: 'sky',
    name: 'Sky Blue',
    icon: '☁️',
    primary: '#0ea5e9',
    primaryDark: '#0284c7',
    primaryLight: '#38bdf8',
    secondary: '#0369a1',
    accent: '#7dd3fc',
    gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
    primaryRgb: hexToRgb('#0ea5e9')
  },
  {
    id: 'fuchsia',
    name: 'Neon Fuchsia',
    icon: '🎆',
    primary: '#d946ef',
    primaryDark: '#c026d3',
    primaryLight: '#e879f9',
    secondary: '#a21caf',
    accent: '#f0abfc',
    gradient: 'linear-gradient(135deg, #d946ef, #c026d3)',
    primaryRgb: hexToRgb('#d946ef')
  },
  // New Mix Pattern Themes
  {
    id: 'sunset-mix',
    name: 'Sunset Mix',
    icon: '🌅',
    primary: '#ff6b6b',
    primaryDark: '#ff5252',
    primaryLight: '#ff8a80',
    secondary: '#ff1744',
    accent: '#ffcdd2',
    gradient: 'linear-gradient(135deg, #ff6b6b, #ff8e53, #ff6b6b)',
    primaryRgb: hexToRgb('#ff6b6b')
  },
  {
    id: 'ocean-mix',
    name: 'Ocean Mix',
    icon: '🌊',
    primary: '#4fc3f7',
    primaryDark: '#29b6f6',
    primaryLight: '#81d4fa',
    secondary: '#0277bd',
    accent: '#b3e5fc',
    gradient: 'linear-gradient(135deg, #4fc3f7, #26c6da, #4fc3f7)',
    primaryRgb: hexToRgb('#4fc3f7')
  },
  {
    id: 'forest-mix',
    name: 'Forest Mix',
    icon: '🌲',
    primary: '#66bb6a',
    primaryDark: '#4caf50',
    primaryLight: '#81c784',
    secondary: '#2e7d32',
    accent: '#c8e6c9',
    gradient: 'linear-gradient(135deg, #66bb6a, #8bc34a, #66bb6a)',
    primaryRgb: hexToRgb('#66bb6a')
  },
  {
    id: 'cosmic-mix',
    name: 'Cosmic Mix',
    icon: '🌌',
    primary: '#9c27b0',
    primaryDark: '#7b1fa2',
    primaryLight: '#ba68c8',
    secondary: '#4a148c',
    accent: '#e1bee7',
    gradient: 'linear-gradient(135deg, #9c27b0, #673ab7, #9c27b0)',
    primaryRgb: hexToRgb('#9c27b0')
  },
  {
    id: 'fire-mix',
    name: 'Fire Mix',
    icon: '🔥',
    primary: '#ff5722',
    primaryDark: '#e64a19',
    primaryLight: '#ff8a65',
    secondary: '#bf360c',
    accent: '#ffccbc',
    gradient: 'linear-gradient(135deg, #ff5722, #ff9800, #ff5722)',
    primaryRgb: hexToRgb('#ff5722')
  },
  {
    id: 'ice-mix',
    name: 'Ice Mix',
    icon: '❄️',
    primary: '#00bcd4',
    primaryDark: '#0097a7',
    primaryLight: '#4dd0e1',
    secondary: '#006064',
    accent: '#b2ebf2',
    gradient: 'linear-gradient(135deg, #00bcd4, #4dd0e1, #00bcd4)',
    primaryRgb: hexToRgb('#00bcd4')
  },
  {
    id: 'gold-mix',
    name: 'Gold Mix',
    icon: '🏆',
    primary: '#ffc107',
    primaryDark: '#ff8f00',
    primaryLight: '#ffd54f',
    secondary: '#ff6f00',
    accent: '#fff8e1',
    gradient: 'linear-gradient(135deg, #ffc107, #ff9800, #ffc107)',
    primaryRgb: hexToRgb('#ffc107')
  },
  {
    id: 'silver-mix',
    name: 'Silver Mix',
    icon: '⚡',
    primary: '#607d8b',
    primaryDark: '#455a64',
    primaryLight: '#90a4ae',
    secondary: '#263238',
    accent: '#cfd8dc',
    gradient: 'linear-gradient(135deg, #607d8b, #78909c, #607d8b)',
    primaryRgb: hexToRgb('#607d8b')
  },
  {
    id: 'rainbow-mix',
    name: 'Rainbow Mix',
    icon: '🌈',
    primary: '#e91e63',
    primaryDark: '#c2185b',
    primaryLight: '#f48fb1',
    secondary: '#880e4f',
    accent: '#fce4ec',
    gradient: 'linear-gradient(135deg, #e91e63, #9c27b0, #3f51b5, #2196f3, #00bcd4, #4caf50, #8bc34a, #cddc39, #ffeb3b, #ff9800, #ff5722, #e91e63)',
    primaryRgb: hexToRgb('#e91e63')
  },
  {
    id: 'neon-mix',
    name: 'Neon Mix',
    icon: '💫',
    primary: '#00e676',
    primaryDark: '#00c853',
    primaryLight: '#69f0ae',
    secondary: '#00a152',
    accent: '#c8e6c9',
    gradient: 'linear-gradient(135deg, #00e676, #00bcd4, #e91e63, #00e676)',
    primaryRgb: hexToRgb('#00e676')
  },
  {
    id: 'aurora-mix',
    name: 'Aurora Mix',
    icon: '🌌',
    primary: '#00bcd4',
    primaryDark: '#0097a7',
    primaryLight: '#4dd0e1',
    secondary: '#006064',
    accent: '#b2ebf2',
    gradient: 'linear-gradient(135deg, #00bcd4, #4caf50, #ff9800, #e91e63, #9c27b0, #00bcd4)',
    primaryRgb: hexToRgb('#00bcd4')
  },
  {
    id: 'steel-mix',
    name: 'Steel Mix',
    icon: '⚙️',
    primary: '#546e7a',
    primaryDark: '#37474f',
    primaryLight: '#78909c',
    secondary: '#263238',
    accent: '#cfd8dc',
    gradient: 'linear-gradient(135deg, #546e7a, #607d8b, #78909c, #546e7a)',
    primaryRgb: hexToRgb('#546e7a')
  },
  {
    id: 'coral-mix',
    name: 'Coral Mix',
    icon: '🪸',
    primary: '#ff7043',
    primaryDark: '#f4511e',
    primaryLight: '#ffab91',
    secondary: '#d84315',
    accent: '#ffccbc',
    gradient: 'linear-gradient(135deg, #ff7043, #ff5722, #ff9800, #ff7043)',
    primaryRgb: hexToRgb('#ff7043')
  },
  {
    id: 'mint-mix',
    name: 'Mint Mix',
    icon: '🌿',
    primary: '#4caf50',
    primaryDark: '#388e3c',
    primaryLight: '#81c784',
    secondary: '#1b5e20',
    accent: '#c8e6c9',
    gradient: 'linear-gradient(135deg, #4caf50, #8bc34a, #cddc39, #4caf50)',
    primaryRgb: hexToRgb('#4caf50')
  },
  {
    id: 'lavender-mix',
    name: 'Lavender Mix',
    icon: '💜',
    primary: '#ba68c8',
    primaryDark: '#ab47bc',
    primaryLight: '#ce93d8',
    secondary: '#7b1fa2',
    accent: '#e1bee7',
    gradient: 'linear-gradient(135deg, #ba68c8, #9c27b0, #673ab7, #ba68c8)',
    primaryRgb: hexToRgb('#ba68c8')
  },
  {
    id: 'peach-mix',
    name: 'Peach Mix',
    icon: '🍑',
    primary: '#ffab91',
    primaryDark: '#ff8a65',
    primaryLight: '#ffccbc',
    secondary: '#ff5722',
    accent: '#fce4ec',
    gradient: 'linear-gradient(135deg, #ffab91, #ff7043, #ff9800, #ffab91)',
    primaryRgb: hexToRgb('#ffab91')
  }
];

export const getThemeById = (id: string): ThemeColor => {
  return themeColors.find(theme => theme.id === id) || themeColors[0];
};

export const applyTheme = (themeId: string) => {
  const theme = getThemeById(themeId);
  const root = document.documentElement;
  
  root.style.setProperty('--primary-color', theme.primary);
  root.style.setProperty('--primary-dark', theme.primaryDark);
  root.style.setProperty('--primary-light', theme.primaryLight);
  root.style.setProperty('--secondary-color', theme.secondary);
  root.style.setProperty('--accent-color', theme.accent);
  root.style.setProperty('--gradient-primary', theme.gradient);
  root.style.setProperty('--primary-rgb', theme.primaryRgb); // Set RGB for rgba() usage
  
  // Update favicon with theme color
  updateFavicon(theme.primary);
  
  // Store in localStorage
  localStorage.setItem('themeColor', themeId);
};

// Update favicon dynamically
const updateFavicon = (primaryColor: string) => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return;
  
  // Draw background circle with theme color
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw white border
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(32, 32, 28, 0, Math.PI * 2);
  ctx.stroke();
  
  // Draw "RC" text (RiderConnect)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('RC', 32, 32);
  
  // Update favicon
  const faviconUrl = canvas.toDataURL('image/png');
  let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
  
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  
  link.href = faviconUrl;
};

export const getStoredTheme = (): string => {
  return localStorage.getItem('themeColor') || 'blue';
};
