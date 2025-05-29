
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.918a0131e54049019beb3d40fdae7fce',
  appName: 'SendKILL APP',
  webDir: 'dist',
  server: {
    url: 'https://918a0131-e540-4901-9beb-3d40fdae7fce.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    }
  }
};

export default config;
