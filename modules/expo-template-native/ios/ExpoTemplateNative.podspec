Pod::Spec.new do |s|
  s.name           = 'ExpoTemplateNative'
  s.version        = '0.1.0'
  s.summary        = 'Minimal local Expo native module example'
  s.description    = 'Reports basic platform information through the Expo Modules API.'
  s.author         = 'Expo App Template contributors'
  s.homepage       = 'https://github.com/547daxia/expo-app-template'
  s.platforms      = {
    :ios => '16.4',
    :tvos => '16.4'
  }
  s.source         = { git: 'https://github.com/547daxia/expo-app-template.git' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
