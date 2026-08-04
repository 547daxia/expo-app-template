module.exports = {
  '**/*.{js,jsx,ts,tsx}': filenames => [
    `pnpm exec eslint --fix ${filenames
      .map(filename => `"${filename}"`)
      .join(' ')}`,
  ],
  '**/*.json': filenames => [
    `pnpm exec eslint --fix ${filenames
      .map(filename => `"${filename}"`)
      .join(' ')}`,
  ],
};
