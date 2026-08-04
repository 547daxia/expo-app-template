import Env from 'env';
import { getNativeRuntimeInfo } from 'modules/expo-template-native';
import { Linking, Share } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAuthStore } from '@/features/auth/use-auth-store';
import { SettingsContainer } from './components/settings-container';
import { SettingsItem } from './components/settings-item';
import { ThemeItem } from './components/theme-item';

export function SettingsScreen() {
  const signOut = useAuthStore.use.signOut();
  const appUrl = Env.EXPO_PUBLIC_APP_URL;
  const nativeRuntime = getNativeRuntimeInfo();

  async function handleSignOut() {
    try {
      await signOut();
    }
    catch {
      showMessage({
        message: 'Unable to sign out.',
        description: 'Your saved session is still active. Please try again.',
        type: 'danger',
      });
    }
  }

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
            text="Native Runtime"
            value={`${nativeRuntime.platform} ${nativeRuntime.systemVersion}`}
          />
          {appUrl && (
            <>
              <Divider />
              <SettingsItem
                text="Website"
                onPress={() => void Linking.openURL(appUrl)}
              />
              <Divider />
              <SettingsItem
                text="Share"
                onPress={() => void Share.share({
                  message: `${Env.EXPO_PUBLIC_NAME}: ${appUrl}`,
                })}
              />
            </>
          )}
        </SettingsContainer>

        <SettingsContainer title="Account">
          <SettingsItem text="Logout" onPress={() => void handleSignOut()} />
        </SettingsContainer>
      </VStack>
    </ScrollView>
  );
}
