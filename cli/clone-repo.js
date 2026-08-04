const fs = require('node:fs');

const {
  getGitHubRepositoryPath,
  normalizeRepository,
  validateTemplateRef,
} = require('./project.js');
const { runCommand } = require('./utils.js');

const DEFAULT_REPOSITORY = 'https://github.com/547daxia/expo-app-template.git';
const DEFAULT_REF = 'master';

async function getTemplateRef({
  fetchImpl = globalThis.fetch,
  githubToken,
  repository,
  requestedRef,
}) {
  if (requestedRef) {
    return validateTemplateRef(requestedRef);
  }

  const repositoryPath = getGitHubRepositoryPath(repository);
  if (!repositoryPath) {
    console.log(`Using mirror default ref ${DEFAULT_REF}`);
    return DEFAULT_REF;
  }

  try {
    const headers = {
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'create-expo-app-template',
    };
    if (githubToken) {
      headers.Authorization = `Bearer ${githubToken}`;
    }
    const response = await fetchImpl(
      `https://api.github.com/repos/${repositoryPath}/releases/latest`,
      { headers, signal: AbortSignal.timeout(10_000) },
    );
    if (!response.ok) {
      throw new Error(`GitHub release lookup returned ${response.status}.`);
    }
    const release = await response.json();
    return validateTemplateRef(release.tag_name);
  }
  catch (error) {
    console.warn(`Could not resolve the latest release (${error.message}). Using ${DEFAULT_REF}.`);
    return DEFAULT_REF;
  }
}

async function cloneTemplate({ env = process.env, fetchImpl, targetDirectory }) {
  if (fs.existsSync(targetDirectory)) {
    throw new Error(`Target directory already exists: ${targetDirectory}`);
  }

  const repository = normalizeRepository(
    env.TEMPLATE_REPOSITORY || DEFAULT_REPOSITORY,
  );
  const templateRef = await getTemplateRef({
    fetchImpl,
    githubToken: env.GITHUB_TOKEN || env.GH_TOKEN,
    repository,
    requestedRef: env.TEMPLATE_REF,
  });

  await runCommand(
    'git',
    ['clone', '--branch', templateRef, '--depth', '1', '--', repository, targetDirectory],
    {
      loading: `Cloning ${repository} at ${templateRef}`,
      success: `Template ${templateRef} cloned`,
    },
  );
  return { repository, templateRef };
}

module.exports = {
  cloneTemplate,
  DEFAULT_REF,
  DEFAULT_REPOSITORY,
  getTemplateRef,
};
