import Env from 'env';
import { Linking, Share } from 'react-native';

import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAuthStore } from '@/features/auth/use-auth-store';
import { SettingsContainer } from './components/settings-container';
import { SettingsItem } from './components/settings-item';
import { ThemeItem } from './components/theme-item';

const REPOSITORY_URL = 'https://github.com/547daxia/expo-app-template';

export function SettingsScreen() {
  const signOut = useAuthStore.use.signOut();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
    >
      <VStack className="gap-6">
        <VStack className="gap-1">
          <Heading selectable size="2xl">Settings</Heading>
          <Text selectable className="text-muted-foreground">
            Manage appearance, app information and your session.
          </Text>
        </VStack>

        <SettingsContainer title="Appearance">
          <ThemeItem />
        </SettingsContainer>

        <SettingsContainer title="About">
          <SettingsItem text="App Name" value={Env.EXPO_PUBLIC_NAME} />
          <Divider />
          <SettingsItem text="Version" value={Env.EXPO_PUBLIC_VERSION} />
          <Divider />
          <SettingsItem
            text="Source Code"
            onPress={() => void Linking.openURL(REPOSITORY_URL)}
          />
          <Divider />
          <SettingsItem
            text="Share"
            onPress={() => void Share.share({
              message: `${Env.EXPO_PUBLIC_NAME}: ${REPOSITORY_URL}`,
            })}
          />
        </SettingsContainer>

        <SettingsContainer title="Account">
          <SettingsItem text="Logout" onPress={signOut} />
        </SettingsContainer>
      </VStack>
    </ScrollView>
  );
}
