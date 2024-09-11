const serializeGitHubRepo = require('../lib/index');
const simpleGit = require('simple-git');
const tree = require('tree-node-cli');
const fs = require('fs-extra');
const { isBinaryFileSync } = require('isbinaryfile');

jest.mock('simple-git');
jest.mock('tree-node-cli');
jest.mock('fs-extra');
jest.mock('isbinaryfile');

describe('serializeGitHubRepo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('clones repository and generates output', async () => {
    const mockClone = jest.fn().mockResolvedValue();
    simpleGit.mockReturnValue({ clone: mockClone });

    fs.mkdtemp.mockResolvedValue('/temp/repo-123');
    tree.mockReturnValue('mock-tree-structure');

    fs.stat.mockImplementation((path) => {
      if (path === '/temp/repo-123') {
        return { isDirectory: () => true, isFile: () => false };
      } else if (path === '/temp/repo-123/subdir') {
        return { isDirectory: () => true, isFile: () => false };
      } else if (path.includes('/subdir/')) {
        return { isDirectory: () => false, isFile: () => true };
      }
      return { isDirectory: () => false, isFile: () => true };
    });

    fs.readdir.mockImplementation((path) => {
      if (path === '/temp/repo-123') {
        return Promise.resolve(['file1.js', 'file2.js', 'subdir']);
      } else if (path === '/temp/repo-123/subdir') {
        return Promise.resolve(['file3.txt']);
      }
      return Promise.resolve([]);
    });

    fs.readFile.mockImplementation((path) => {
      if (path.endsWith('.js') || path.endsWith('.txt')) {
        return Promise.resolve('file content');
      }
      return Promise.resolve('');
    });

    isBinaryFileSync.mockImplementation((path) => path.endsWith('.bin'));

    const result = await serializeGitHubRepo('https://github.com/user/repo.git');

    expect(mockClone).toHaveBeenCalledWith('https://github.com/user/repo.git', '/temp/repo-123');
    expect(tree).toHaveBeenCalledWith('/temp/repo-123', expect.objectContaining({
      allFiles: true,
      exclude: expect.any(Array),
      maxDepth: 4,
    }));
    expect(result).toContain('```structure\nmock-tree-structure\n```');
    expect(result).toContain('/file1.js\n```js\nfile content\n```');
    expect(result).toContain('/file2.js\n```js\nfile content\n```');
    expect(result).toContain('/subdir/file3.txt\n```txt\nfile content\n```');
  });

  test('handles errors gracefully', async () => {
    simpleGit.mockReturnValue({ clone: jest.fn().mockRejectedValue(new Error('Clone failed')) });

    await expect(serializeGitHubRepo('https://github.com/user/repo.git')).rejects.toThrow('Clone failed');
  });
});