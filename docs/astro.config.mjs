import { defineConfig, passthroughImageService } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLlmsTxt from 'starlight-llms-txt';

const site = process.env.PUBLIC_DOCUMENTATION_SITE ?? 'http://localhost:4321/';
const repository = process.env.PUBLIC_DOCUMENTATION_REPOSITORY
  ?? 'https://github.com/547daxia/expo-app-template';

// https://astro.build/config
export default defineConfig({
  site,
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
      components: {
        LastUpdated: './src/components/LastUpdated.astro',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: repository },
      ],
      head: [
        {
          tag: 'meta',
          attrs: { property: 'og:image', content: site + 'og.jpg?v=1' },
        },
        {
          tag: 'meta',
          attrs: { property: 'twitter:image', content: site + 'og.jpg?v=1' },
        },
        {
          tag: 'link',
          attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossorigin: true,
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&display=swap',
          },
        },
      ],
      sidebar: [
        {
          label: 'Project Documentation',
          link: '/project-documentation/',
        },
        {
          label: 'Overview',
          link: '/overview',
        },
        {
          label: 'Recipes',
          items: [
            // Each item here is one entry in the navigation menu.
            {
              label: 'Sentry Setup',
              link: '/recipes/sentry-setup/',
              badge: 'new',
            },
          ],
        },
        {
          label: 'Libraries Recommendation',
          link: '/libraries-recommendation',
        },
        {
          label: 'FAQ',
          link: '/faq',
          badge: 'new',
        },
        {
          label: 'CHANGELOG',
          link: '/changelog',
        },
        {
          label: 'How to contribute ?',
          link: '/how-to-contribute',
        },
        {
          label: 'Reviews',
          link: '/reviews',
          badge: 'new',
        },
        {
          label: 'Stay Updated',
          link: '/stay-updated',
        },
      ],
      customCss: ['./src/styles/custom.css'],
      lastUpdated: true,
    }),
  ],
  image: {
    service: passthroughImageService(),
  },
  // Prevent Vite from externalizing zod, which conflicts with the root project's zod@4
  vite: {
    ssr: {
      noExternal: ['zod'],
    },
  },
});
