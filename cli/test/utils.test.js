const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { runCommand } = require('../utils.js');

test('passes command arguments literally without shell evaluation', async (context) => {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'expo-template-command-'));
  context.after(() => fs.rmSync(temporaryRoot, { force: true, recursive: true }));
  const output = path.join(temporaryRoot, 'argument.txt');
  const literal = 'value;$(touch should-not-run)';

  await runCommand(
    process.execPath,
    [
      '-e',
      'require(\'node:fs\').writeFileSync(process.argv[1], process.argv[2])',
      output,
      literal,
    ],
    { loading: 'Testing argument handling', stdio: 'ignore', success: 'Argument handled' },
  );

  assert.equal(fs.readFileSync(output, 'utf8'), literal);
  assert.equal(fs.existsSync(path.join(process.cwd(), 'should-not-run')), false);
});
