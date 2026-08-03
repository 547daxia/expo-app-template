import { Ionicons } from '@expo/vector-icons';
import Env from 'env';
import { useUniwind } from 'uniwind';

import {
  colors,
  FocusAwareStatusBar,
  ScrollView,
  Text,
  View,
} from '@/components/ui';
import { useAuthStore as useAuth } from '@/features/auth/use-auth-store';
import { SettingsContainer } from './components/settings-container';
import { SettingsItem } from './components/settings-item';
import { ThemeItem } from './components/theme-item';

export function SettingsScreen() {
  const signOut = useAuth.use.signOut();
  const { theme } = useUniwind();
  const iconColor
    = theme === 'dark' ? colors.neutral[400] : colors.neutral[500];
  return (
    <>
      <FocusAwareStatusBar />

      <ScrollView>
        <View className="flex-1 px-4 pt-16">
          <Text className="text-xl font-bold">
            Settings
          </Text>
          <SettingsContainer title="General">
            <ThemeItem />
          </SettingsContainer>

          <SettingsContainer title="About">
            <SettingsItem
              text="App Name"
              value={Env.EXPO_PUBLIC_NAME}
            />
            <SettingsItem
              text="Version"
              value={Env.EXPO_PUBLIC_VERSION}
            />
          </SettingsContainer>

          <SettingsContainer title="Support Us">
            <SettingsItem
              text="Share"
              icon={<Ionicons name="share-outline" color={iconColor} size={20} />}
              onPress={() => {}}
            />
            <SettingsItem
              text="Rate"
              icon={<Ionicons name="star-outline" color={iconColor} size={20} />}
              onPress={() => {}}
            />
            <SettingsItem
              text="Support"
              icon={<Ionicons name="heart-outline" color={iconColor} size={20} />}
              onPress={() => {}}
            />
          </SettingsContainer>

          <SettingsContainer title="Links">
            <SettingsItem text="Privacy Policy" onPress={() => {}} />
            <SettingsItem text="Terms of Service" onPress={() => {}} />
            <SettingsItem
              text="GitHub"
              icon={<Ionicons name="logo-github" color={iconColor} size={20} />}
              onPress={() => {}}
            />
            <SettingsItem
              text="Website"
              icon={<Ionicons name="globe-outline" color={iconColor} size={20} />}
              onPress={() => {}}
            />
          </SettingsContainer>

          <View className="my-8">
            <SettingsContainer>
              <SettingsItem text="Logout" onPress={signOut} />
            </SettingsContainer>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
