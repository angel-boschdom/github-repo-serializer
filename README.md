# Markdown-based GitHub Repository Serializer

Node.js tool to serialize entire GitHub repositories into a markdown string.

## Installation

```bash
npm install -g github-repo-serializer
```

## Usage

### Command Line

The following command...
```bash
github-repo-serializer --r https://github.com/octocat/Hello-World.git
```

...produces the following output:
<pre><code>
```structure
repo-n1hDcL
└── README
```

/README
```
Hello World!

```</code></pre>

To write the output in a text file, use the "output" optional argument:
```bash
github-repo-serializer --r https://github.com/octocat/Hello-World.git --o myserializedrepo.txt
```

To serialize the current directory tree, omit the "repo" optional argument:
```bash
github-repo-serializer --o myserializedcd.txt
```

### Programmatically

```javascript
const serializeGitHubRepo = require('github-repo-serializer');

serializeGitHubRepo('https://github.com/octocat/Hello-World.git')
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