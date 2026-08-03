import { readdirSync } from 'node:fs';
import path from 'node:path';

import { COMPONENT_GROUPS } from './component-groups';

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
});
