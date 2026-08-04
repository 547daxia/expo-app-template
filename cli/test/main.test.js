const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { main } = require('../index.js');

function runGit(cwd, args) {
  execFileSync('git', args, { cwd, stdio: 'ignore' });
}

test('creates a complete project from a local template repository', async (context) => {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'expo-template-main-'));
  context.after(() => fs.rmSync(temporaryRoot, { force: true, recursive: true }));
  const source = path.join(temporaryRoot, 'source-template');
  fs.mkdirSync(source);

  for (const directory of ['cli', 'docs', 'documentation', 'modules']) {
    fs.mkdirSync(path.join(source, directory));
    fs.writeFileSync(path.join(source, directory, '.keep'), '');
  }
  fs.writeFileSync(path.join(source, '.env.example'), 'EXPO_PUBLIC_APP_ENV=development\n');
  fs.appendFileSync(path.join(source, '.env.example'), 'EXPO_SLUG=mobile-app\n');
  fs.writeFileSync(
    path.join(source, 'app.config.ts'),
    'const EXPO_SLUG = process.env.EXPO_SLUG ?? \'mobile-app\';\n',
  );
  fs.writeFileSync(path.join(source, 'LICENSE'), 'MIT');
  fs.writeFileSync(path.join(source, 'README.md'), 'Template readme');
  fs.writeFileSync(path.join(source, 'README-project.md'), 'Generated project readme');
  fs.writeFileSync(
    path.join(source, 'env.ts'),
    fs.readFileSync(path.resolve(__dirname, '../../env.ts')),
  );
  fs.writeFileSync(
    path.join(source, 'package.json'),
    `${JSON.stringify({
      name: 'template',
      private: true,
      scripts: {
        'test:ci': 'node --test && pnpm run test:cli',
        'test:cli': 'node --test cli/test/*.test.js',
      },
      version: '9.9.9',
    }, null, 2)}\n`,
  );
  runGit(source, ['init', '--initial-branch=main']);
  runGit(source, ['config', 'user.email', 'cli-test@example.com']);
  runGit(source, ['config', 'user.name', 'CLI Test']);
  runGit(source, ['add', '.']);
  runGit(source, ['commit', '-m', 'test fixture']);

  const generated = await main({
    argv: ['customer-portal'],
    cwd: temporaryRoot,
    env: {
      TEMPLATE_REF: 'main',
      TEMPLATE_REPOSITORY: source,
    },
  });

  assert.equal(generated.project.packageName, 'customer-portal');
  assert.equal(generated.source.templateRef, 'main');
  assert.equal(fs.existsSync(path.join(generated.targetDirectory, '.git')), true);
  assert.equal(fs.existsSync(path.join(generated.targetDirectory, 'cli')), false);
  assert.equal(fs.existsSync(path.join(generated.targetDirectory, 'docs')), true);
  assert.equal(fs.existsSync(path.join(generated.targetDirectory, 'documentation')), true);
  assert.equal(fs.existsSync(path.join(generated.targetDirectory, 'modules')), true);
  assert.equal(fs.readFileSync(path.join(generated.targetDirectory, 'LICENSE'), 'utf8'), 'MIT');
  assert.match(
    fs.readFileSync(path.join(generated.targetDirectory, 'env.ts'), 'utf8'),
    /production: 'com\.customerportal'/,
  );
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(generated.targetDirectory, 'package.json'), 'utf8'),
  );
  assert.equal(packageJson.scripts['test:cli'], undefined);
  assert.equal(packageJson.scripts['test:ci'], 'node --test');
});
