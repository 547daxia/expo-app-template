import Env from 'env';

import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { ScrollView } from '@/components/ui/scroll-view';
import { StatusBar } from '@/components/ui/status-bar';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useIsFirstTime } from '@/lib/hooks/use-is-first-time';
import { navigate } from '@/lib/navigation';

const FEATURES = [
  'Production-ready Expo Router structure',
  'Gluestack UI with light and dark themes',
  'Typed forms, data fetching and local state',
];

export function OnboardingScreen() {
  const [, setIsFirstTime] = useIsFirstTime();

  const finishOnboarding = () => {
    setIsFirstTime(false);
    navigate.replace('/login');
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
    >
      <StatusBar barStyle="default" />
      <VStack className="mx-auto w-full max-w-lg gap-8">
        <VStack className="gap-3">
          <Text selectable className="text-sm font-semibold text-primary uppercase">
            Welcome
          </Text>
          <Heading selectable size="3xl">{Env.EXPO_PUBLIC_NAME}</Heading>
          <Text selectable className="text-lg/7 text-muted-foreground">
            A focused foundation for building reliable cross-platform applications.
          </Text>
        </VStack>

        <Card className="gap-4 rounded-2xl border border-border bg-card p-5">
          {FEATURES.map(feature => (
            <Text selectable key={feature} className="text-base">
              ✓
              {' '}
              {feature}
            </Text>
          ))}
        </Card>

        <Button size="lg" onPress={finishOnboarding}>
          <ButtonText>Get Started</ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  );
}
