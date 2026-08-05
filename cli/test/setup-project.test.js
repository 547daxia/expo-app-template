const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { createProjectIdentity } = require('../project.js');
const { prepareProjectFiles } = require('../setup-project.js');

test('prepares a generated project while preserving its license and operations docs', (context) => {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'expo-template-cli-'));
  context.after(() => fs.rmSync(temporaryRoot, { force: true, recursive: true }));

  const projectDirectory = path.join(temporaryRoot, 'customer-portal');
  fs.mkdirSync(projectDirectory);
  for (const directory of ['.git', 'android', 'cli', 'docs', 'documentation', 'ios', 'modules', '.github', '.github/workflows']) {
    fs.mkdirSync(path.join(projectDirectory, directory));
  }
  fs.writeFileSync(
    path.join(projectDirectory, '.env.example'),
    'EXPO_SLUG=mobile-app\n',
  );
  fs.writeFileSync(
    path.join(projectDirectory, 'app.config.ts'),
    'const EXPO_SLUG = process.env.EXPO_SLUG ?? \'mobile-app\';\n',
  );
  fs.writeFileSync(path.join(projectDirectory, 'LICENSE'), 'MIT');
  fs.writeFileSync(path.join(projectDirectory, 'README.md'), 'Template readme');
  fs.writeFileSync(path.join(projectDirectory, 'README-project.md'), 'Project readme');
  fs.writeFileSync(
    path.join(projectDirectory, '.github/workflows/e2e-android.yml'),
    'APP_ID=com.example.mobileapp.preview\n',
  );
  fs.writeFileSync(
    path.join(projectDirectory, 'env.ts'),
    fs.readFileSync(path.resolve(__dirname, '../../env.ts')),
  );
  fs.writeFileSync(
    path.join(projectDirectory, 'package.json'),
    JSON.stringify({
      name: 'expo-app-template',
      osMetadata: { initVersion: '0.0.2' },
      repository: { url: 'template' },
      scripts: {
        'e2e-test:development': 'maestro -e APP_ID=com.example.mobileapp.development',
        'test:ci': 'jest --coverage && pnpm run test:cli',
        'test:cli': 'node --test cli/test/*.test.js',
      },
      version: '0.0.2',
    }),
  );

  prepareProjectFiles(
    projectDirectory,
    createProjectIdentity('customer-portal'),
  );

  assert.equal(fs.readFileSync(path.join(projectDirectory, 'README.md'), 'utf8'), 'Project readme');
  assert.equal(fs.readFileSync(path.join(projectDirectory, 'LICENSE'), 'utf8'), 'MIT');
  assert.equal(fs.existsSync(path.join(projectDirectory, 'documentation')), true);
  assert.equal(fs.existsSync(path.join(projectDirectory, 'docs')), true);
  assert.equal(fs.existsSync(path.join(projectDirectory, 'modules')), true);
  for (const removed of ['.git', 'android', 'cli', 'ios', 'README-project.md']) {
    assert.equal(fs.existsSync(path.join(projectDirectory, removed)), false);
  }

  const packageJson = JSON.parse(
    fs.readFileSync(path.join(projectDirectory, 'package.json'), 'utf8'),
  );
  assert.deepEqual(packageJson, {
    name: 'customer-portal',
    scripts: {
      'e2e-test:development': 'maestro -e APP_ID=com.customerportal.development',
      'test:ci': 'jest --coverage',
    },
    version: '0.0.1',
  });
  assert.match(
    fs.readFileSync(path.join(projectDirectory, '.env.example'), 'utf8'),
    /EXPO_SLUG=customer-portal/,
  );
  assert.match(
    fs.readFileSync(path.join(projectDirectory, 'app.config.ts'), 'utf8'),
    /EXPO_SLUG \?\? 'customer-portal'/,
  );
  assert.equal(
    fs.readFileSync(path.join(projectDirectory, '.github/workflows/e2e-android.yml'), 'utf8'),
    'APP_ID=com.customerportal.preview\n',
  );
});
