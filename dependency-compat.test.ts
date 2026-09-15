import { execFileSync } from 'node:child_process';

it('keeps Expo Router query decoding compatible with the patched decoder', () => {
  // Execute the actual CommonJS consumer outside Jest's module transforms.
  const output = execFileSync(process.execPath, ['-e', `
    const { createRequire } = require('node:module');
    const routerRequire = createRequire(require.resolve('expo-router/package.json'));
    const queryString = routerRequire('query-string');
    const parsed = queryString.parse('name=%E4%B8%AD%E6%96%87&tag=a&tag=b&space=hello+world');
    const roundTrip = queryString.parse(queryString.stringify(parsed));
    const malformed = '%FF'.repeat(10000);
    const recovered = queryString.parse('bad=' + malformed + '%41').bad;
    console.log(JSON.stringify({ parsed, roundTrip, recovered }));
  `], { encoding: 'utf8', timeout: 5000 });

  const result = JSON.parse(output);
  const expected = { name: '中文', tag: ['a', 'b'], space: 'hello world' };
  expect(result.parsed).toEqual(expected);
  expect(result.roundTrip).toEqual(expected);
  expect(result.recovered).toBe(`${'%FF'.repeat(10000)}A`);
});
