import 'react-native-reanimated';

// Gluestack's copied ZoomIn calls include opacity: 0. Reanimated 4.5.1
// picks only transform values at runtime, so that extra field is ignored.
// Keep this exception limited to ZoomIn and the generated literal; remove it
// when upstream regeneration removes opacity from those calls.
declare module 'react-native-reanimated' {
  // Declaration merging requires an interface matching the upstream class.
  // eslint-disable-next-line ts/consistent-type-definitions
  interface ZoomIn {
    withInitialValues: (values: {
      transform?: [{ scale: number }];
      opacity?: 0;
    }) => this;
  }
}
