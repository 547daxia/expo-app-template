const packageJson = require('../package.json');

const expectedTag = `v${packageJson.version}`;
const receivedTag = process.env.GITHUB_REF_NAME;

if (receivedTag !== expectedTag) {
  console.error(`Expected tag ${expectedTag}, received ${receivedTag ?? '(none)'}.`);
  process.exit(1);
}

console.log(`Tag ${receivedTag} matches package version ${packageJson.version}.`);
