import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'memoria-viva',
  webDir: 'www',
  plugins: {
  GoogleAuth: {
    scopes: ['profile', 'email'],
    serverClientId: '186532293956-jcpen7sd2ov7vjnjgd2746damf80j0r5.apps.googleusercontent.com',
    forceCodeForRefreshToken: true
  }
}
};


export default config;
