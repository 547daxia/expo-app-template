import ExpoModulesCore
import UIKit

public class ExpoTemplateNativeModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoTemplateNative")

    Function("getRuntimeInfo") {
      return [
        "platform": "ios",
        "systemVersion": UIDevice.current.systemVersion,
      ]
    }
  }
}
