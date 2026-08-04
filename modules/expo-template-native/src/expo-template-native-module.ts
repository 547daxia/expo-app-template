import type { NativeRuntimeInfo } from './expo-template-native.types';
import { NativeModule, requireNativeModule } from 'expo';

declare class ExpoTemplateNativeModule extends NativeModule {
  getRuntimeInfo(): NativeRuntimeInfo;
}

export default requireNativeModule<ExpoTemplateNativeModule>('ExpoTemplateNative');
