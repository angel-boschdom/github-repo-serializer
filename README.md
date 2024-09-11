# Markdown-based GitHub Repository Serializer

Node.js tool to serialize entire GitHub repositories into a markdown string.

## Installation

```bash
npm install -g github-repo-serializer
```

## Usage

### Command Line

```bash
github-repo-serializer https://github.com/username/repo.git
```

### Programmatically

```javascript
const serializeGitHubRepo = require('github-repo-serializer');

serializeGitHubRepo('https://github.com/username/repo.git')
  .then(output => console.log(output))
  .catch(error => console.error('Error:', error));
```

## Development

### Running Tests

To run the tests:

```bash
npm test
```

## Continuous Integration

This project uses GitHub Actions for continuous integration. Tests are automatically run on push and pull requests to the main branch.

## License
MIT license