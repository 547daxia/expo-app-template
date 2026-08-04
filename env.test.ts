const originalEnv = { ...process.env };

function loadEnvironment() {
  jest.isolateModules(() => {
    jest.requireActual('./env');
  });
}

describe('environment validation', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.STRICT_ENV_VALIDATION;
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    jest.restoreAllMocks();
  });

  it('fails production configuration without requiring an explicit strict flag', () => {
    process.env.EXPO_PUBLIC_APP_ENV = 'production';
    process.env.EXPO_PUBLIC_API_URL = 'https://dummyjson.com';

    expect(loadEnvironment).toThrow('Invalid environment variables');
  });

  it('rejects a project-owned API endpoint that does not use HTTPS', () => {
    process.env.EXPO_PUBLIC_APP_ENV = 'production';
    process.env.EXPO_PUBLIC_API_URL = 'http://api.project.test';

    expect(loadEnvironment).toThrow('Invalid environment variables');
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining(
      'Production builds require an HTTPS API endpoint.',
    ));
  });
});
