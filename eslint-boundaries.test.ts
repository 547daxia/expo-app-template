import { spawnSync } from 'node:child_process';
import path from 'node:path';

function lintText(source: string, filePath: string) {
  const result = spawnSync(
    'pnpm',
    ['exec', 'eslint', '--format', 'json', '--stdin', '--stdin-filename', filePath],
    { encoding: 'utf8', input: source },
  );

  if (!result.stdout) {
    throw new Error(result.stderr || 'ESLint did not return a report.');
  }

  return JSON.parse(result.stdout)[0] as { messages: Array<{ ruleId: string; severity: number }> };
}

describe('eslint architecture boundaries', () => {
  it('keeps feature isolation active for the Style Demo FlatList exception', () => {
    const filePath = path.join(
      process.cwd(),
      'src/features/style-demo/__boundary-contract__.ts',
    );
    const crossFeatureResult = lintText(
      'import \'@/features/auth/login-screen\';',
      filePath,
    );
    const flatListResult = lintText(
      'import { FlatList } from \'react-native\';\nvoid FlatList;',
      filePath,
    );

    expect(crossFeatureResult.messages).toEqual(expect.arrayContaining([
      expect.objectContaining({ ruleId: 'no-restricted-imports', severity: 2 }),
    ]));
    expect(flatListResult.messages).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ ruleId: 'no-restricted-imports' }),
    ]));
  });
});
