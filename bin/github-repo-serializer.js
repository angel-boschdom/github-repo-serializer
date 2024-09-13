#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const serializeGitHubRepo = require('../lib/index');

// Set up yargs for named arguments
const argv = yargs
  .option('repo', {
    alias: 'r',
    description: 'GitHub repository URL or local path to serialize',
    type: 'string',
  })
  .option('output', {
    alias: 'o',
    description: 'Output file to write the serialized data',
    type: 'string',
  })
  .help()
  .alias('help', 'h')
  .argv;

// Get the repository or folder path and the output file from the arguments
const repoUrlOrPath = argv.repo || process.cwd(); // Default to the current directory if no repo is provided
const outputFile = argv.output;

// Function to handle output (file or console)
function handleOutput(output, outputFile) {
  if (outputFile) {
    fs.writeFile(outputFile, output, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        process.exit(1);
      }
      console.log(`Output written to ${outputFile}`);
    });
  } else {
    console.log(output);
  }
}

// Serialize the provided GitHub repo or local path
serializeGitHubRepo(repoUrlOrPath)
  .then(output => handleOutput(output, outputFile))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
