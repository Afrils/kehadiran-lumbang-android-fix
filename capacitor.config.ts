
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lumbang.presensi',
  appName: 'kehadiran-lumbang-android-fix',
  webDir: 'dist',
  server: {
    url: 'https://6b702a5b-9c0f-4efb-b05e-1f7342395f87.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
