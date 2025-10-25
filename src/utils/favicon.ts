// Dynamic Favicon Generator - Updates favicon based on theme color

export const updateFavicon = (primaryColor: string) => {
  // Create a canvas element
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
  
  // Draw motorcycle emoji (text fallback)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🏍', 32, 32);
  
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

// Default favicon
export const setDefaultFavicon = () => {
  updateFavicon('#3b82f6'); // Default blue
};

