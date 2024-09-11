const serializeGitHubRepo = require('../lib/index');
const simpleGit = require('simple-git');
const tree = require('tree-node-cli');
const fs = require('fs-extra');

jest.mock('simple-git');
jest.mock('tree-node-cli');
jest.mock('fs-extra');

describe('serializeGitHubRepo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('clones repository and generates output', async () => {
    const mockClone = jest.fn().mockResolvedValue();
    simpleGit.mockReturnValue({ clone: mockClone });

    fs.mkdtemp.mockResolvedValue('/temp/repo-123');
    tree.mockReturnValue('mock-tree-structure');

    fs.stat.mockImplementation((path) => ({
      isDirectory: () => path === '/temp/repo-123',
      isFile: () => path !== '/temp/repo-123',
    }));

    fs.readdir.mockResolvedValue(['file1.js', 'file2.js']);
    fs.readFile.mockResolvedValue('file content');

    const result = await serializeGitHubRepo('https://github.com/user/repo.git');

    expect(mockClone).toHaveBeenCalledWith('https://github.com/user/repo.git', '/temp/repo-123');
    expect(tree).toHaveBeenCalledWith('/temp/repo-123', expect.any(Object));
    expect(result).toContain('```structure\nmock-tree-structure\n```');
    expect(result).toContain('/file1.js\n```js\nfile content\n```');
    expect(result).toContain('/file2.js\n```js\nfile content\n```');
  });

  test('handles errors gracefully', async () => {
    simpleGit.mockReturnValue({ clone: jest.fn().mockRejectedValue(new Error('Clone failed')) });

    await expect(serializeGitHubRepo('https://github.com/user/repo.git')).rejects.toThrow('Clone failed');
  });
});