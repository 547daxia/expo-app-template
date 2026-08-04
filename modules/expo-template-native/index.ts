import ExpoTemplateNativeModule from './src/expo-template-native-module';

export type { NativeRuntimeInfo } from './src/expo-template-native.types';

export function getNativeRuntimeInfo() {
  return ExpoTemplateNativeModule.getRuntimeInfo();
}
