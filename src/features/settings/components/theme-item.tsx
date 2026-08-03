import type { ColorSchemeType } from '@/lib/hooks/use-selected-theme';

import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { useSelectedTheme } from '@/lib/hooks/use-selected-theme';

const THEMES: Array<{ label: string; value: ColorSchemeType }> = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

export function ThemeItem() {
  const { selectedTheme, setSelectedTheme } = useSelectedTheme();

  return (
    <VStack className="gap-3 p-4">
      <HStack className="gap-2">
        {THEMES.map(theme => (
          <Button
            key={theme.value}
            accessibilityState={{ selected: selectedTheme === theme.value }}
            className="flex-1"
            variant={selectedTheme === theme.value ? 'default' : 'outline'}
            onPress={() => setSelectedTheme(theme.value)}
          >
            <ButtonText>{theme.label}</ButtonText>
          </Button>
        ))}
      </HStack>
    </VStack>
  );
}
