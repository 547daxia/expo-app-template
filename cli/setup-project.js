const fs = require('node:fs');
const path = require('node:path');

const { updateEnvSource } = require('./project.js');
const { runCommand } = require('./utils.js');

const TEMPLATE_ONLY_PATHS = [
  '.git',
  'README.md',
  'android',
  'ios',
  'cli',
];

function readRequiredFile(file) {
  if (!fs.existsSync(file)) {
    throw new Error(`The template is missing ${file}.`);
  }
  return fs.readFileSync(file, 'utf8');
}

function updatePackageJson(targetDirectory, identity) {
  const packagePath = path.join(targetDirectory, 'package.json');
  const packageJson = JSON.parse(readRequiredFile(packagePath));
  packageJson.name = identity.packageName;
  packageJson.version = '0.0.1';
  if (packageJson.scripts) {
    delete packageJson.scripts['test:cli'];
    packageJson.scripts['test:ci'] = packageJson.scripts['test:ci']
      ?.replace(' && pnpm run test:cli', '');
    for (const [name, command] of Object.entries(packageJson.scripts)) {
      if (typeof command === 'string') {
        packageJson.scripts[name] = command.replaceAll(
          'com.example.mobileapp',
          identity.applicationIdBase,
        );
      }
    }
  }
  delete packageJson.osMetadata;
  delete packageJson.repository;
  fs.writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
}

function updateProjectConfig(targetDirectory, identity) {
  const configPath = path.join(targetDirectory, 'env.ts');
  const source = readRequiredFile(configPath);
  fs.writeFileSync(configPath, updateEnvSource(source, identity));

  replaceRequiredText(
    path.join(targetDirectory, 'app.config.ts'),
    'const EXPO_SLUG = process.env.EXPO_SLUG ?? \'mobile-app\';',
    `const EXPO_SLUG = process.env.EXPO_SLUG ?? '${identity.slug}';`,
  );
  replaceRequiredText(
    path.join(targetDirectory, '.env.example'),
    'EXPO_SLUG=mobile-app',
    `EXPO_SLUG=${identity.slug}`,
  );
}

function replaceRequiredText(file, search, replacement) {
  const source = readRequiredFile(file);
  if (!source.includes(search)) {
    throw new Error(`The template placeholder was not found in ${file}.`);
  }
  fs.writeFileSync(file, source.replace(search, replacement));
}

function prepareProjectFiles(targetDirectory, identity) {
  for (const relativePath of TEMPLATE_ONLY_PATHS) {
    fs.rmSync(path.join(targetDirectory, relativePath), {
      force: true,
      recursive: true,
    });
  }

  updatePackageJson(targetDirectory, identity);
  updateProjectConfig(targetDirectory, identity);

  const projectReadme = path.join(targetDirectory, 'README-project.md');
  readRequiredFile(projectReadme);
  fs.renameSync(projectReadme, path.join(targetDirectory, 'README.md'));
}

async function setupProject(targetDirectory, identity) {
  console.log('▶ Applying project identity and removing template-only files');
  prepareProjectFiles(targetDirectory, identity);
  await runCommand(
    'git',
    ['init', '--initial-branch=main'],
    {
      cwd: targetDirectory,
      loading: 'Initializing a fresh Git repository',
      success: 'Git repository initialized on main',
    },
  );
}

async function installDependencies(targetDirectory) {
  await runCommand('pnpm', ['install'], {
    cwd: targetDirectory,
    loading: 'Installing project dependencies with pnpm',
    success: 'Project dependencies installed',
  });
}

module.exports = {
  installDependencies,
  prepareProjectFiles,
  setupProject,
  TEMPLATE_ONLY_PATHS,
};
