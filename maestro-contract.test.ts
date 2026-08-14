import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

function collectYaml(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return collectYaml(target);
    }
    return entry.name.endsWith('.yaml') ? [target] : [];
  });
}

describe('maestro contracts', () => {
  const maestroDirectory = path.join(process.cwd(), '.maestro');

  it('uses stable selectors instead of template-specific visible text', () => {
    const source = collectYaml(maestroDirectory)
      .map(file => readFileSync(file, 'utf8'))
      .join('\n');

    expect(source).not.toContain('Expo App Template');
    expect(source).not.toMatch(/\d+ component groups/);
    expect(source).toContain('id: onboarding-title');
    expect(source).toContain('id: style-catalog-count');
  });
});
