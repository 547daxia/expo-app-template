import z from 'zod';

import packageJSON from './package.json';

const DEVELOPMENT_API_URL = 'https://dummyjson.com';
const DEMO_API_HOSTS = new Set(['api.example.com', 'dummyjson.com']);
const TEMPLATE_APP_NAME = 'MobileApp';
const TEMPLATE_IDENTIFIER_PREFIX = 'com.example.';

// Single unified environment schema
const envSchema = z.object({
  EXPO_PUBLIC_APP_ENV: z.enum(['development', 'preview', 'production']),
  EXPO_PUBLIC_NAME: z.string(),
  EXPO_PUBLIC_SCHEME: z.string(),
  EXPO_PUBLIC_BUNDLE_ID: z.string(),
  EXPO_PUBLIC_PACKAGE: z.string(),
  EXPO_PUBLIC_VERSION: z.string(),
  EXPO_PUBLIC_API_URL: z.string().url(),
  EXPO_PUBLIC_APP_URL: z.string().url().optional(),
  EXPO_PUBLIC_ASSOCIATED_DOMAIN: z.string().url().optional(),
  EXPO_PUBLIC_VAR_NUMBER: z.number(),
  EXPO_PUBLIC_VAR_BOOL: z.boolean(),

  // only available for app.config.ts usage
  APP_BUILD_ONLY_VAR: z.string().optional(),
}).superRefine((env, context) => {
  if (env.EXPO_PUBLIC_APP_ENV !== 'production') {
    return;
  }

  const apiUrl = new URL(env.EXPO_PUBLIC_API_URL);
  if (apiUrl.protocol !== 'https:') {
    context.addIssue({
      code: 'custom',
      path: ['EXPO_PUBLIC_API_URL'],
      message: 'Production builds require an HTTPS API endpoint.',
    });
  }

  const apiHost = apiUrl.hostname.toLowerCase();
  if (DEMO_API_HOSTS.has(apiHost)) {
    context.addIssue({
      code: 'custom',
      path: ['EXPO_PUBLIC_API_URL'],
      message: 'Production builds require a project-owned API endpoint.',
    });
  }

  if (env.EXPO_PUBLIC_NAME === TEMPLATE_APP_NAME) {
    context.addIssue({
      code: 'custom',
      path: ['EXPO_PUBLIC_NAME'],
      message: 'Replace the template application name before a production build.',
    });
  }

  for (const field of ['EXPO_PUBLIC_BUNDLE_ID', 'EXPO_PUBLIC_PACKAGE'] as const) {
    if (env[field].startsWith(TEMPLATE_IDENTIFIER_PREFIX)) {
      context.addIssue({
        code: 'custom',
        path: [field],
        message: 'Replace the template application identifier before a production build.',
      });
    }
  }
});

// Config records per environment
const EXPO_PUBLIC_APP_ENV = (process.env.EXPO_PUBLIC_APP_ENV
  ?? 'development') as z.infer<typeof envSchema>['EXPO_PUBLIC_APP_ENV'];

const BUNDLE_IDS = {
  development: 'com.example.mobileapp.development',
  preview: 'com.example.mobileapp.preview',
  production: 'com.example.mobileapp',
} as const;

const PACKAGES = {
  development: 'com.example.mobileapp.development',
  preview: 'com.example.mobileapp.preview',
  production: 'com.example.mobileapp',
} as const;

const SCHEMES = {
  development: 'mobileapp',
  preview: 'mobileapp.preview',
  production: 'mobileapp',
} as const;

const NAME = 'MobileApp';

// Production configuration must always fail closed. Other environments can opt
// into the same behavior for prebuild and CI validation.
const STRICT_ENV_VALIDATION = EXPO_PUBLIC_APP_ENV === 'production'
  || process.env.STRICT_ENV_VALIDATION === '1';

// Build env object
const _env: z.infer<typeof envSchema> = {
  EXPO_PUBLIC_APP_ENV,
  EXPO_PUBLIC_NAME: NAME,
  EXPO_PUBLIC_SCHEME: SCHEMES[EXPO_PUBLIC_APP_ENV],
  EXPO_PUBLIC_BUNDLE_ID: BUNDLE_IDS[EXPO_PUBLIC_APP_ENV],
  EXPO_PUBLIC_PACKAGE: PACKAGES[EXPO_PUBLIC_APP_ENV],
  EXPO_PUBLIC_VERSION: packageJSON.version,
  // Development defaults to the public demo API used by the example feed.
  // Production validation rejects this endpoint so it cannot ship by mistake.
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL
    ?? (STRICT_ENV_VALIDATION ? '' : DEVELOPMENT_API_URL),
  EXPO_PUBLIC_APP_URL: process.env.EXPO_PUBLIC_APP_URL,
  EXPO_PUBLIC_ASSOCIATED_DOMAIN: process.env.EXPO_PUBLIC_ASSOCIATED_DOMAIN,
  EXPO_PUBLIC_VAR_NUMBER: Number(process.env.EXPO_PUBLIC_VAR_NUMBER ?? 0),
  EXPO_PUBLIC_VAR_BOOL: process.env.EXPO_PUBLIC_VAR_BOOL === 'true',
  APP_BUILD_ONLY_VAR: process.env.APP_BUILD_ONLY_VAR,
};

function getValidatedEnv(env: z.infer<typeof envSchema>) {
  const parsed = envSchema.safeParse(env);

  if (parsed.success === false) {
    const errorMessage
      = `❌ Invalid environment variables:${
        JSON.stringify(parsed.error.flatten().fieldErrors, null, 2)
      }\n❌ Missing variables in .env file for APP_ENV=${EXPO_PUBLIC_APP_ENV}`
      + `\n💡 Tip: If you recently updated the .env file, try restarting with -c flag to clear the cache.`;

    if (STRICT_ENV_VALIDATION) {
      console.error(errorMessage);
      throw new Error('Invalid environment variables');
    }

    console.warn(errorMessage);
  }
  else {
    console.log('✅ Environment variables validated successfully');
  }

  return parsed.success ? parsed.data : env;
}

const Env = getValidatedEnv(_env);

export default Env;
