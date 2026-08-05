import { existsSync, readFileSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsRoot = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(scriptsRoot, '..');
const workspaceRoot = path.resolve(docsRoot, '..');
const contentRoot = path.join(docsRoot, 'src', 'content', 'docs');

const entries = [
  ['documentation/README.md', 'documentation/index.md'],
  ['documentation/getting-started/project-creation.md', 'getting-started/project-creation.md'],
  ['documentation/getting-started/configuration.md', 'getting-started/configuration.md'],
  ['documentation/getting-started/development.md', 'getting-started/development.md'],
  ['documentation/core/architecture.md', 'core/architecture.md'],
  ['documentation/core/authentication.md', 'core/authentication.md'],
  ['documentation/core/navigation.md', 'core/navigation.md'],
  ['documentation/core/data-fetching.md', 'core/data-fetching.md'],
  ['documentation/core/storage.md', 'core/storage.md'],
  ['documentation/ui/README.md', 'ui/index.md'],
  ['documentation/ui/components.md', 'ui/components.md'],
  ['documentation/ui/gluestack-ui-maintenance.md', 'ui/gluestack-ui-maintenance.md'],
  ['documentation/ui/forms.md', 'ui/forms.md'],
  ['documentation/ui/fonts.md', 'ui/fonts.md'],
  ['documentation/platform/native-modules.md', 'platform/native-modules.md'],
  ['documentation/quality/testing.md', 'quality/testing.md'],
  ['documentation/quality/dependency-upgrades.md', 'quality/dependency-upgrades.md'],
  ['documentation/operations/release.md', 'operations/release.md'],
  ['documentation/operations/production-readiness.md', 'operations/production-readiness.md'],
  ['documentation/recipes/sentry.md', 'recipes/sentry.md'],
  ['documentation/decisions/2026-08-03-documentation-structure.md', 'decisions/2026-08-03-documentation-structure.md'],
  ['documentation/decisions/2026-08-03-gluestack-ui-migration.md', 'decisions/2026-08-03-gluestack-ui-migration.md'],
  ['CONTRIBUTING.md', 'contributing.md'],
];

const sourceToRoute = new Map(entries.map(([source, output]) => [
  path.resolve(workspaceRoot, source),
  `/${output.replace(/\/index\.md$/, '/').replace(/\.md$/, '/')}`,
]));

function getRepository() {
  if (process.env.PUBLIC_DOCUMENTATION_REPOSITORY) {
    return process.env.PUBLIC_DOCUMENTATION_REPOSITORY.replace(/\/+$/, '');
  }

  const manifestPath = path.join(workspaceRoot, 'package.json');
  if (!existsSync(manifestPath)) {
    return null;
  }

  const repository = JSON.parse(readFileSync(manifestPath, 'utf8')).repository;
  const value = typeof repository === 'string' ? repository : repository?.url;
  return typeof value === 'string'
    ? value.replace(/^git\+/, '').replace(/\.git$/, '').replace(/\/+$/, '')
    : null;
}

const repository = getRepository();
const branch = process.env.PUBLIC_DOCUMENTATION_BRANCH ?? 'master';

function rewriteLinks(markdown, sourcePath) {
  return markdown.replace(
    /(\[[^\]]*])\((<[^>]+>|[^)\s]+)(\s+["'][^)]*["'])?\)/g,
    (match, label, rawTarget, title = '') => {
      const target = rawTarget.replace(/^<|>$/g, '');
      if (/^(?:[a-z][a-z\d+.-]*:|#|\/)/i.test(target)) {
        return match;
      }

      const suffixIndex = target.search(/[?#]/);
      const pathname = suffixIndex === -1 ? target : target.slice(0, suffixIndex);
      const suffix = suffixIndex === -1 ? '' : target.slice(suffixIndex);
      let resolved;

      try {
        resolved = path.resolve(path.dirname(sourcePath), decodeURIComponent(pathname));
      }
      catch {
        return match;
      }

      const canonicalRoute = sourceToRoute.get(resolved);
      if (canonicalRoute) {
        return `${label}(${canonicalRoute}${suffix}${title})`;
      }

      if (
        repository
        && resolved.startsWith(`${workspaceRoot}${path.sep}`)
        && existsSync(resolved)
      ) {
        const repositoryPath = path.relative(workspaceRoot, resolved).split(path.sep).join('/');
        return `${label}(${repository}/blob/${branch}/${repositoryPath}${suffix}${title})`;
      }

      return repository ? match : label;
    },
  );
}

function withFrontmatter(markdown, source) {
  const title = markdown.match(/^#\s+(.+)$/m)?.[1];
  if (!title) {
    throw new Error(`Canonical documentation needs a level-one heading: ${source}`);
  }

  return `---\ntitle: ${JSON.stringify(title)}\n---\n\n${markdown}`;
}

for (const outputDirectory of [
  'documentation',
  'getting-started',
  'core',
  'ui',
  'platform',
  'quality',
  'operations',
  'recipes',
  'decisions',
]) {
  rmSync(path.join(contentRoot, outputDirectory), { force: true, recursive: true });
}
rmSync(path.join(contentRoot, 'contributing.md'), { force: true });

for (const [source, output] of entries) {
  const sourcePath = path.resolve(workspaceRoot, source);
  const outputPath = path.join(contentRoot, output);

  if (!existsSync(sourcePath)) {
    throw new Error(`Canonical documentation source is missing: ${source}`);
  }

  mkdirSync(path.dirname(outputPath), { recursive: true });
  const markdown = readFileSync(sourcePath, 'utf8');
  writeFileSync(outputPath, withFrontmatter(rewriteLinks(markdown, sourcePath), source));
}

console.log(`Synced ${entries.length} canonical documentation pages.`);
