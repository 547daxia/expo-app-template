const path = require('node:path');

const MAX_PROJECT_NAME_LENGTH = 64;
const PROJECT_NAME_PATTERN = /^[a-z\d](?:[\w.-]*[a-z\d])?$/i;
const TEMPLATE_REF_PATTERN = /^[a-z\d][\w./-]*$/i;
const WINDOWS_RESERVED_NAMES = new Set([
  'aux',
  'com1',
  'com2',
  'com3',
  'com4',
  'com5',
  'com6',
  'com7',
  'com8',
  'com9',
  'con',
  'lpt1',
  'lpt2',
  'lpt3',
  'lpt4',
  'lpt5',
  'lpt6',
  'lpt7',
  'lpt8',
  'lpt9',
  'nul',
  'prn',
]);

function validateProjectName(projectName) {
  if (typeof projectName !== 'string' || projectName.length === 0) {
    throw new TypeError('Provide a project name, for example: my-app');
  }
  if (projectName.length > MAX_PROJECT_NAME_LENGTH) {
    throw new TypeError(`Project names must be ${MAX_PROJECT_NAME_LENGTH} characters or fewer.`);
  }
  if (!PROJECT_NAME_PATTERN.test(projectName)) {
    throw new TypeError(
      'Project names may contain letters, numbers, dots, underscores, and hyphens, and must start and end with a letter or number.',
    );
  }
  const portableBaseName = projectName.split('.')[0].toLowerCase();
  if (
    portableBaseName === 'node_modules'
    || WINDOWS_RESERVED_NAMES.has(portableBaseName)
  ) {
    throw new TypeError(`Project name is reserved on supported platforms: ${projectName}`);
  }
  return projectName;
}

function toSlug(projectName) {
  return projectName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[._]+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

function toDisplayName(projectName) {
  if (!/[._-]/.test(projectName)) {
    return projectName;
  }
  return projectName
    .split(/[._-]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function createProjectIdentity(input) {
  const directoryName = validateProjectName(input);
  const slug = toSlug(directoryName);
  const rawIdentifier = slug.replace(/[^a-z0-9]/g, '');
  const identifier = /^[a-z]/.test(rawIdentifier)
    ? rawIdentifier
    : `app${rawIdentifier}`;
  const scheme = /^[a-z]/.test(slug) ? slug : `app-${slug}`;

  return {
    applicationIdBase: `com.${identifier}`,
    directoryName,
    displayName: toDisplayName(directoryName),
    packageName: slug,
    scheme,
    slug,
  };
}

function validateTemplateRef(ref) {
  if (typeof ref !== 'string' || ref.length === 0 || ref.length > 255) {
    throw new TypeError('TEMPLATE_REF must be a non-empty Git branch or tag.');
  }
  if (
    !TEMPLATE_REF_PATTERN.test(ref)
    || ref.includes('..')
    || ref.includes('@{')
    || ref.includes('//')
    || ref.endsWith('/')
  ) {
    throw new TypeError(`Invalid TEMPLATE_REF: ${ref}`);
  }
  return ref;
}

function normalizeRepository(repository) {
  if (typeof repository !== 'string' || repository.length === 0) {
    throw new TypeError('TEMPLATE_REPOSITORY must be a Git repository URL.');
  }
  if (/\p{C}/u.test(repository) || repository.startsWith('-')) {
    throw new TypeError('TEMPLATE_REPOSITORY contains invalid characters.');
  }
  return repository.replace(/\/+$/, '');
}

function getGitHubRepositoryPath(repository) {
  const normalized = normalizeRepository(repository);
  try {
    const url = new URL(normalized);
    if (url.hostname.toLowerCase() !== 'github.com') {
      return null;
    }
    const repositoryPath = url.pathname
      .replace(/^\/+|\/+$/g, '')
      .replace(/\.git$/, '');
    return repositoryPath.split('/').length === 2 ? repositoryPath : null;
  }
  catch {
    const sshMatch = normalized.match(/^git@github\.com:([^/]+\/[^/]+?)(?:\.git)?$/);
    return sshMatch?.[1] ?? null;
  }
}

function resolveTargetDirectory(cwd, directoryName) {
  const validatedName = validateProjectName(directoryName);
  const root = path.resolve(cwd);
  const target = path.resolve(root, validatedName);
  if (path.dirname(target) !== root) {
    throw new TypeError('The project must be created directly inside the current directory.');
  }
  return target;
}

function replaceConfigBlock(source, name, value) {
  const pattern = new RegExp(`const ${name} = \\{[\\s\\S]*?\\} as const;`);
  if (!pattern.test(source)) {
    throw new Error(`The template env.ts is missing the ${name} configuration block.`);
  }
  return source.replace(pattern, value);
}

function updateEnvSource(source, identity) {
  const ids = identity.applicationIdBase;
  let updated = replaceConfigBlock(source, 'BUNDLE_IDS', `const BUNDLE_IDS = {
  development: '${ids}.development',
  preview: '${ids}.preview',
  production: '${ids}',
} as const;`);
  updated = replaceConfigBlock(updated, 'PACKAGES', `const PACKAGES = {
  development: '${ids}.development',
  preview: '${ids}.preview',
  production: '${ids}',
} as const;`);
  updated = replaceConfigBlock(updated, 'SCHEMES', `const SCHEMES = {
  development: '${identity.scheme}',
  preview: '${identity.scheme}.preview',
  production: '${identity.scheme}',
} as const;`);

  const namePattern = /const NAME = 'MobileApp';/;
  if (!namePattern.test(updated)) {
    throw new Error('The template env.ts is missing the application name placeholder.');
  }
  return updated.replace(
    namePattern,
    `const NAME = ${JSON.stringify(identity.displayName)};`,
  );
}

module.exports = {
  createProjectIdentity,
  getGitHubRepositoryPath,
  normalizeRepository,
  resolveTargetDirectory,
  updateEnvSource,
  validateProjectName,
  validateTemplateRef,
};
