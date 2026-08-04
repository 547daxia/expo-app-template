const assert = require('node:assert/strict');
const test = require('node:test');

const { DEFAULT_REF, getTemplateRef } = require('../clone-repo.js');

test('uses an explicitly requested template ref without a network request', async () => {
  let fetched = false;
  const ref = await getTemplateRef({
    fetchImpl: async () => {
      fetched = true;
    },
    repository: 'https://github.com/owner/project.git',
    requestedRef: 'v2.0.0',
  });

  assert.equal(ref, 'v2.0.0');
  assert.equal(fetched, false);
});

test('resolves the latest GitHub release tag', async () => {
  const ref = await getTemplateRef({
    fetchImpl: async (url, options) => {
      assert.equal(url, 'https://api.github.com/repos/owner/project/releases/latest');
      assert.equal(options.headers['User-Agent'], 'create-expo-app-template');
      return {
        json: async () => ({ tag_name: 'v3.1.4' }),
        ok: true,
      };
    },
    repository: 'https://github.com/owner/project.git',
  });

  assert.equal(ref, 'v3.1.4');
});

test('uses the default branch for a mirror without an explicit ref', async () => {
  assert.equal(
    await getTemplateRef({
      repository: 'https://git.example.com/mobile/template.git',
    }),
    DEFAULT_REF,
  );
});

test('falls back to the default branch when GitHub release lookup fails', async () => {
  const originalWarn = console.warn;
  console.warn = () => {};
  try {
    const ref = await getTemplateRef({
      fetchImpl: async () => ({ ok: false, status: 403 }),
      repository: 'https://github.com/owner/project.git',
    });
    assert.equal(ref, DEFAULT_REF);
  }
  finally {
    console.warn = originalWarn;
  }
});
