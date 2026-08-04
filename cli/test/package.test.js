const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const cliDirectory = path.resolve(__dirname, '..');

test('publishes only the documented executable package surface', () => {
  const output = execFileSync('npm', ['pack', '--dry-run', '--json'], {
    cwd: cliDirectory,
    encoding: 'utf8',
  });
  const [archive] = JSON.parse(output);
  const files = archive.files.map(file => file.path).sort();

  assert.deepEqual(files, [
    'LICENSE',
    'README.md',
    'clone-repo.js',
    'index.js',
    'package.json',
    'project.js',
    'setup-project.js',
    'utils.js',
  ]);
  assert.equal(
    archive.files.find(file => file.path === 'index.js').mode,
    0o755,
  );
  assert.equal(
    fs.readFileSync(path.join(cliDirectory, 'LICENSE'), 'utf8'),
    fs.readFileSync(path.resolve(cliDirectory, '../LICENSE'), 'utf8'),
  );
});
