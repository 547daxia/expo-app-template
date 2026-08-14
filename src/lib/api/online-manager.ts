import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import { Platform } from 'react-native';

export function configureOnlineManager() {
  if (Platform.OS === 'web') {
    return;
  }

  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
      setOnline(state.isInternetReachable ?? state.isConnected ?? false);
    });
  });
}
