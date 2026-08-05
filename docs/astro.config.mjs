import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, passthroughImageService } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLlmsTxt from 'starlight-llms-txt';

const site = process.env.PUBLIC_DOCUMENTATION_SITE ?? 'http://localhost:4321/';
const rootManifest = JSON.parse(readFileSync(
  fileURLToPath(new URL('../package.json', import.meta.url)),
  'utf8',
));
const repositoryValue = rootManifest.repository?.url ?? rootManifest.repository;
const repository = process.env.PUBLIC_DOCUMENTATION_REPOSITORY
  ?? (typeof repositoryValue === 'string'
    ? repositoryValue.replace(/^git\+/, '').replace(/\.git$/, '')
    : undefined);

export default defineConfig({
  site,
  redirects: {
    '/project-documentation/': '/documentation/',
    '/getting-started/create-new-app/': '/getting-started/project-creation/',
    '/getting-started/customize-app/': '/getting-started/configuration/',
    '/getting-started/environment-vars-config/': '/getting-started/configuration/',
    '/getting-started/first-project-setup/': '/getting-started/configuration/',
    '/getting-started/project-structure/': '/core/architecture/',
    '/getting-started/rules-and-conventions/': '/getting-started/development/',
    '/guides/authentication/': '/core/authentication/',
    '/guides/data-fetching/': '/core/data-fetching/',
    '/guides/native-modules/': '/platform/native-modules/',
    '/guides/navigation/': '/core/navigation/',
    '/guides/storage/': '/core/storage/',
    '/guides/upgrading-deps/': '/quality/dependency-upgrades/',
    '/testing/end-to-end-testing/': '/quality/testing/',
    '/testing/overview/': '/quality/testing/',
    '/testing/unit-testing/': '/quality/testing/',
    '/ui-and-theme/components/': '/ui/components/',
    '/ui-and-theme/forms/': '/ui/forms/',
    '/ui-and-theme/fonts/': '/ui/fonts/',
    '/ui-and-theme/ui-theming/': '/ui/',
    '/ci-cd/app-releasing-process/': '/operations/release/',
    '/ci-cd/overview/': '/operations/release/',
    '/ci-cd/workflows-references/': '/operations/release/',
    '/how-to-contribute/': '/contributing/',
    '/reviews/': '/contributing/',
  },
  integrations: [
    starlight({
      title: 'Expo App Template Documentation',
      plugins: [starlightLlmsTxt()],
      description: 'Practical documentation for building, testing, and shipping Expo and React Native applications.',
      expressiveCode: {
        themes: ['dracula', 'solarized-light'],
      },
      logo: {
        light: '/src/assets/logo-titled.svg',
        dark: '/src/assets/logo-titled.svg',
        replacesTitle: true,
      },
      social: repository
        ? [{ icon: 'github', label: 'GitHub', href: repository }]
        : [],
      sidebar: [
        { label: 'Documentation Map', link: '/documentation/' },
        {
          label: 'Getting Started',
          items: [
            { label: 'Project Creation', link: '/getting-started/project-creation/' },
            { label: 'Configuration and Environments', link: '/getting-started/configuration/' },
            { label: 'Development Workflow', link: '/getting-started/development/' },
          ],
        },
        {
          label: 'Core Application',
          items: [
            { label: 'Architecture', link: '/core/architecture/' },
            { label: 'Authentication', link: '/core/authentication/' },
            { label: 'Navigation', link: '/core/navigation/' },
            { label: 'Data Fetching', link: '/core/data-fetching/' },
            { label: 'Storage', link: '/core/storage/' },
          ],
        },
        {
          label: 'UI and Platform',
          items: [
            { label: 'UI and Theming', link: '/ui/' },
            { label: 'UI Components', link: '/ui/components/' },
            { label: 'Gluestack UI Maintenance', link: '/ui/gluestack-ui-maintenance/' },
            { label: 'Forms', link: '/ui/forms/' },
            { label: 'Fonts', link: '/ui/fonts/' },
            { label: 'Local Native Modules', link: '/platform/native-modules/' },
          ],
        },
        {
          label: 'Quality and Operations',
          items: [
            { label: 'Testing', link: '/quality/testing/' },
            { label: 'Dependency Upgrades', link: '/quality/dependency-upgrades/' },
            { label: 'Release and CI/CD', link: '/operations/release/' },
            { label: 'Production Readiness', link: '/operations/production-readiness/' },
          ],
        },
        {
          label: 'More',
          items: [
            { label: 'Sentry Setup', link: '/recipes/sentry/' },
            { label: 'Contributing', link: '/contributing/' },
            { label: 'Overview', link: '/overview/' },
            { label: 'FAQ', link: '/faq/' },
            { label: 'Optional Libraries', link: '/libraries-recommendation/' },
            { label: 'Changelog', link: '/changelog/' },
            { label: 'Update Sources', link: '/stay-updated/' },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
      lastUpdated: true,
    }),
  ],
  image: {
    service: passthroughImageService(),
  },
  vite: {
    ssr: {
      noExternal: ['zod'],
    },
  },
});
