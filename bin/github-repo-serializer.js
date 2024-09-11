#!/usr/bin/env node

const serializeGitHubRepo = require('../lib/index');

const repoUrl = process.argv[2];

if (!repoUrl) {
  console.error('Please provide a GitHub repository URL');
  process.exit(1);
}

serializeGitHubRepo(repoUrl)
  .then(output => console.log(output))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
