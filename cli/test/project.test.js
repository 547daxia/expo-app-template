const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const {
  createProjectIdentity,
  getGitHubRepositoryPath,
  resolveTargetDirectory,
  updateEnvSource,
  validateProjectName,
  validateTemplateRef,
} = require('../project.js');

test('derives stable app identity from a kebab-case directory name', () => {
  assert.deepEqual(createProjectIdentity('customer-portal'), {
    applicationIdBase: 'com.customerportal',
    directoryName: 'customer-portal',
    displayName: 'Customer Portal',
    packageName: 'customer-portal',
    scheme: 'customer-portal',
    slug: 'customer-portal',
  });
});

test('supports an existing PascalCase project naming convention', () => {
  assert.deepEqual(createProjectIdentity('CustomerPortal'), {
    applicationIdBase: 'com.customerportal',
    directoryName: 'CustomerPortal',
    displayName: 'CustomerPortal',
    packageName: 'customer-portal',
    scheme: 'customer-portal',
    slug: 'customer-portal',
  });
});

test('rejects paths, spaces, shell syntax, and hidden-directory names', () => {
  for (const name of ['', '../app', 'my app', 'app;touch', '.git', 'app/child']) {
    assert.throws(() => validateProjectName(name), TypeError);
  }
});

test('rejects project names that are not portable across supported platforms', () => {
  for (const name of ['CON', 'nul.txt', 'LPT9', 'node_modules']) {
    assert.throws(() => validateProjectName(name), TypeError);
  }
});

test('resolves the target as a direct child of the working directory', () => {
  assert.equal(
    resolveTargetDirectory('/tmp/projects', 'my-app'),
    path.resolve('/tmp/projects/my-app'),
  );
});

test('updates every application identity block without changing demo guards', () => {
  const source = fs.readFileSync(path.resolve(__dirname, '../../env.ts'), 'utf8');
  const identity = createProjectIdentity('customer-portal');
  const updated = updateEnvSource(source, identity);

  assert.match(updated, /const NAME = "Customer Portal";/);
  assert.match(updated, /production: 'com\.customerportal'/);
  assert.match(updated, /development: 'com\.customerportal\.development'/);
  assert.match(updated, /production: 'customer-portal'/);
  assert.doesNotMatch(updated, /com\.example\.mobileapp/);
  assert.match(updated, /TEMPLATE_IDENTIFIER_PREFIX = 'com\.example\.'/);
});

test('accepts common Git refs and rejects revision expressions', () => {
  assert.equal(validateTemplateRef('v1.2.3'), 'v1.2.3');
  assert.equal(validateTemplateRef('release/next'), 'release/next');
  assert.throws(() => validateTemplateRef('main~1'), TypeError);
  assert.throws(() => validateTemplateRef('../main'), TypeError);
});

test('extracts GitHub repository paths from HTTPS and SSH URLs', () => {
  assert.equal(
    getGitHubRepositoryPath('https://github.com/owner/project.git'),
    'owner/project',
  );
  assert.equal(
    getGitHubRepositoryPath('git@github.com:owner/project.git'),
    'owner/project',
  );
  assert.equal(getGitHubRepositoryPath('https://git.example.com/project'), null);
});
