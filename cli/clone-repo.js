const { runCommand } = require('./utils.js');
const { consola } = require('consola');

const templateRepository = (
  process.env.TEMPLATE_REPOSITORY
  || 'https://github.com/547daxia/expo-app-template'
).replace(/\.git$/, '').replace(/\/+$/, '');
const configuredRef = process.env.TEMPLATE_REF;
const fallbackRef = configuredRef || 'master';

function getGitHubRepositoryPath(repository) {
  try {
    const url = new URL(repository);
    if (url.hostname !== 'github.com') return null;
    return url.pathname.replace(/^\/+|\/+$/g, '');
  } catch {
    const sshMatch = repository.match(/^git@github\.com:(.+)$/);
    return sshMatch?.[1].replace(/^\/+|\/+$/g, '') ?? null;
  }
}

const repositoryPath = getGitHubRepositoryPath(templateRepository);

const getTemplateRef = async () => {
  if (configuredRef) {
    return configuredRef;
  }

  if (!repositoryPath) {
    consola.info(`Using mirror default ref ${fallbackRef}`);
    return fallbackRef;
  }

  try {
    const repoData = await fetch(
      `https://api.github.com/repos/${repositoryPath}/releases/latest`
    );
    if (!repoData.ok) {
      throw new Error(`GitHub release lookup failed with ${repoData.status}`);
    }
    const releaseData = await repoData.json();
    return releaseData.tag_name || fallbackRef;
  } catch (error) {
    console.warn(
      `Failed to retrieve the latest release; will use ${fallbackRef} instead`
    );
    return fallbackRef;
  }
};

const cloneLastTemplateRelease = async (projectName) => {
  consola.start('Extracting last release number 👀');
  const templateRef = await getTemplateRef();
  consola.info(`Using template ref ${templateRef}`);

  const cloneStarter = `git clone -b ${templateRef} --depth=1 ${templateRepository}.git ${projectName}`;
  await runCommand(cloneStarter, {
    loading: 'Extracting the starter template...',
    success: 'Starter extracted successfully',
    error: 'Failed to download and extract template',
  });
};

module.exports = {
  cloneLastTemplateRelease,
};
