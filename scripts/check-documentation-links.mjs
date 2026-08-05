import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const roots = [
  'README.md',
  'README-project.md',
  'CONTRIBUTING.md',
  'AGENTS.md',
  'cli/README.md',
  'modules/README.md',
  'docs/README.md',
  'documentation',
];

function collectMarkdown(target) {
  const absolute = path.join(root, target);
  if (!existsSync(absolute)) {
    return [];
  }

  if (!absolute.endsWith('.md')) {
    return readdirSync(absolute, { withFileTypes: true })
      .flatMap(entry => collectMarkdown(path.join(target, entry.name)));
  }

  return [absolute];
}

const files = roots.flatMap(collectMarkdown);
const broken = [];
let checked = 0;

for (const file of files) {
  const markdown = readFileSync(file, 'utf8');
  const links = markdown.matchAll(/\[[^\]]*\]\((<[^>]+>|[^)\s]+)(?:\s+["'][^)]*["'])?\)/g);

  for (const link of links) {
    let target = link[1].replace(/^<|>$/g, '');
    if (/^(?:[a-z][a-z\d+.-]*:|#|\/)/i.test(target)) {
      continue;
    }

    target = target.split(/[?#]/, 1)[0];
    if (!target) {
      continue;
    }

    checked += 1;
    let resolved;
    try {
      resolved = path.resolve(path.dirname(file), decodeURIComponent(target));
    }
    catch {
      broken.push(`${path.relative(root, file)} -> ${target} (invalid encoding)`);
      continue;
    }

    if (!existsSync(resolved)) {
      broken.push(`${path.relative(root, file)} -> ${target}`);
    }
  }
}

if (broken.length > 0) {
  console.error(`Broken local documentation links:\n${broken.join('\n')}`);
  process.exitCode = 1;
}
else {
  console.log(`Validated ${checked} local documentation links across ${files.length} Markdown files.`);
}
