package expo.modules.expotemplatenative

import android.os.Build
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoTemplateNativeModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoTemplateNative")

    Function("getRuntimeInfo") {
      mapOf(
        "platform" to "android",
        "systemVersion" to Build.VERSION.RELEASE,
      )
    }
  }
}
