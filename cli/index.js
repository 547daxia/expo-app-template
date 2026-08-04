#!/usr/bin/env node
const { cloneTemplate } = require('./clone-repo.js');
const {
  createProjectIdentity,
  resolveTargetDirectory,
} = require('./project.js');
const {
  installDependencies,
  setupProject,
} = require('./setup-project.js');
const {
  showIntroduction,
  showMoreDetails,
} = require('./utils.js');

async function main({
  argv = process.argv.slice(2),
  cwd = process.cwd(),
  env = process.env,
  fetchImpl,
} = {}) {
  if (argv.length !== 1) {
    throw new TypeError('Usage: create-expo-app-template <project-name>');
  }

  const project = createProjectIdentity(argv[0]);
  const targetDirectory = resolveTargetDirectory(cwd, project.directoryName);

  showIntroduction();
  const source = await cloneTemplate({ env, fetchImpl, targetDirectory });
  await setupProject(targetDirectory, project);
  await installDependencies(targetDirectory);
  showMoreDetails(project);

  return { project, source, targetDirectory };
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`\n✖ ${error.message}`);
    if (process.env.DEBUG === '1') {
      console.error(error.stack);
    }
    process.exitCode = 1;
  });
}

module.exports = { main };
