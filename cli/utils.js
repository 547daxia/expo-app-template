#!/usr/bin/env node
const { spawn } = require('node:child_process');

function runCommand(command, args, options = {}) {
  const {
    cwd,
    loading = `Running ${command}`,
    stdio = 'inherit',
    success = `${command} completed`,
  } = options;

  console.log(`▶ ${loading}`);
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      shell: false,
      stdio,
    });

    child.once('error', (error) => {
      reject(new Error(`Unable to start ${command}: ${error.message}`, { cause: error }));
    });
    child.once('exit', (code, signal) => {
      if (code === 0) {
        console.log(`✓ ${success}`);
        resolve();
        return;
      }
      const reason = signal ? `signal ${signal}` : `exit code ${code}`;
      reject(new Error(`${command} failed with ${reason}.`));
    });
  });
}

function showIntroduction() {
  console.log('\nExpo App Template');
  console.log('Create a production-oriented Expo project\n');
}

function showMoreDetails(project) {
  console.log('\n✓ Your project is ready.');
  console.log('\nNext steps:');
  console.log(`  cd ${project.directoryName}`);
  console.log('  cp .env.example .env');
  console.log('  pnpm start');
  console.log('\nBefore EAS or production builds, follow:');
  console.log('  documentation/configuration.md');
  console.log('  documentation/production-readiness.md');
}

module.exports = {
  runCommand,
  showIntroduction,
  showMoreDetails,
};
