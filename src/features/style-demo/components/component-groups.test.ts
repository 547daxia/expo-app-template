import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { COMPONENT_GROUPS, PROJECT_COMPONENT_GROUPS } from './component-groups';

describe('style demo component inventory', () => {
  it('tracks every top-level shared UI directory', () => {
    const uiDirectory = path.join(process.cwd(), 'src/components/ui');
    const componentDirectories = readdirSync(uiDirectory, {
      withFileTypes: true,
    })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort();

    expect([...COMPONENT_GROUPS].sort()).toEqual(componentDirectories);
  });

  it('imports every shared UI group except the root-mounted provider', () => {
    const styleDemoDirectory = path.join(process.cwd(), 'src/features/style-demo');
    const componentDirectory = path.join(styleDemoDirectory, 'components');
    const demoFiles = [
      path.join(styleDemoDirectory, 'style-screen.tsx'),
      ...readdirSync(componentDirectory)
        .filter(file => file.endsWith('.tsx'))
        .map(file => path.join(componentDirectory, file)),
    ];
    const importedGroups = new Set<string>();

    for (const file of demoFiles) {
      const source = readFileSync(file, 'utf8');
      for (const match of source.matchAll(/@\/components\/ui\/([a-z0-9-]+)/g)) {
        importedGroups.add(match[1]);
      }
    }

    const expectedGroups = COMPONENT_GROUPS
      .filter(group => group !== 'gluestack-ui-provider')
      .sort();

    expect([...importedGroups].sort()).toEqual(expectedGroups);
  });
});

it('keeps project-owned compound components outside generated source and in the demo', () => {
  const directory = path.join(process.cwd(), 'src/features/style-demo/components');
  const source = readdirSync(directory)
    .filter(file => file.endsWith('.tsx'))
    .map(file => readFileSync(path.join(directory, file), 'utf8'))
    .join('\n');
  for (const group of PROJECT_COMPONENT_GROUPS) {
    expect(readdirSync(path.join(process.cwd(), 'src/components'))).toContain(group);
    expect(source).toContain(`@/components/${group}`);
    expect(source).not.toContain(`@/components/ui/${group}`);
  }
});
