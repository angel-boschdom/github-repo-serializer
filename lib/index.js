const simpleGit = require('simple-git');
const tree = require('tree-node-cli');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

async function serializeGitHubRepo(repoUrl) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'repo-'));

  try {
    await simpleGit().clone(repoUrl, tempDir);
    console.log('Repository cloned successfully');

    const treeOutput = tree(tempDir, {
      allFiles: true,
      exclude: ['.git', 'node_modules'],
      maxDepth: 4,
    });

    let output = '```structure\n' + treeOutput + '\n```\n\n';

    const queue = [tempDir];
    const processedPaths = new Set();

    while (queue.length > 0) {
      const currentPath = queue.shift();
      const relativePath = path.relative(tempDir, currentPath);

      if (processedPaths.has(currentPath)) continue;
      processedPaths.add(currentPath);

      const stats = await fs.stat(currentPath);

      if (stats.isDirectory()) {
        const items = await fs.readdir(currentPath);
        for (const item of items) {
          queue.push(path.join(currentPath, item));
        }
      } else if (stats.isFile()) {
        const fileContent = await fs.readFile(currentPath, 'utf-8');
        const fileExtension = path.extname(currentPath).slice(1);
        output += `/${relativePath}\n\`\`\`${fileExtension}\n${fileContent}\n\`\`\`\n\n`;
      }
    }

    return output;
  } finally {
    await fs.remove(tempDir);
  }
}

module.exports = serializeGitHubRepo;