#!/usr/bin/env node

const fs = require('fs');
const serializeGitHubRepo = require('../lib/index');

// Get the repository URL and optional output file path from the command-line arguments
const repoUrl = process.argv[2];
const outputFile = process.argv[3];

if (!repoUrl) {
  console.error('Please provide a GitHub repository URL');
  process.exit(1);
}

serializeGitHubRepo(repoUrl)
  .then(output => {
    if (outputFile) {
      // Write the output to the specified file
      fs.writeFile(outputFile, output, (err) => {
        if (err) {
          console.error('Error writing to file:', err);
          process.exit(1);
        }
        console.log(`Output written to ${outputFile}`);
      });
    } else {
      // Print the output to the console
      console.log(output);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
