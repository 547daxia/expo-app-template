import type { NativeRuntimeInfo } from './expo-template-native.types';
import { NativeModule, registerWebModule } from 'expo';

class ExpoTemplateNativeModule extends NativeModule {
  getRuntimeInfo(): NativeRuntimeInfo {
    return {
      platform: 'web',
      systemVersion: 'browser',
    };
  }
}

export default registerWebModule(ExpoTemplateNativeModule, 'ExpoTemplateNative');
