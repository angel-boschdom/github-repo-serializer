const simpleGit = require('simple-git');
const tree = require('tree-node-cli');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { isBinaryFileSync } = require("isbinaryfile");

async function serializeGitHubRepo(repoUrl) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'repo-'));

  try {
    await simpleGit().clone(repoUrl, tempDir);

    const treeOptions = {
      allFiles: true,
      exclude: [/.git/, /node_modules/],
      maxDepth: 4,
    };

    const treeOutput = tree(tempDir, treeOptions);

    let output = '```structure\n' + treeOutput + '\n```\n\n';

    const excludedDirs = new Set(['.git', 'node_modules']);
    const queue = [tempDir];
    const processedPaths = new Set();

    while (queue.length > 0) {
        const currentPath = queue.shift();
        const relativePath = path.relative(tempDir, currentPath);
  
        if (processedPaths.has(currentPath)) continue;
        processedPaths.add(currentPath);
  
        const stats = await fs.stat(currentPath);
        const baseName = path.basename(currentPath);
  
        if (excludedDirs.has(baseName)) {
          continue;
        }
  
        if (stats.isDirectory()) {
          const items = await fs.readdir(currentPath);
          for (const item of items) {
            queue.push(path.join(currentPath, item));
          }
        } else if (stats.isFile()) {
          const isBinary = isBinaryFileSync(currentPath);
          const fileExtension = path.extname(currentPath).slice(1);
          
          if (isBinary) {
            output += `/${relativePath}\n\`\`\`${fileExtension}\nBINARY_FILE\n\`\`\`\n\n`;
          } else {
            const fileContent = await fs.readFile(currentPath, 'utf-8');
            output += `/${relativePath}\n\`\`\`${fileExtension}\n${fileContent}\n\`\`\`\n\n`;
          }
        }
    }
    return output;
  } catch (error) {
    console.error('Error in serializeGitHubRepo:', error);
    throw error;
  } finally {
    await fs.remove(tempDir);
  }
}

module.exports = serializeGitHubRepo;