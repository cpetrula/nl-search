# nl-search

A powerful npm package for searching multi-level arrays of JSON objects using natural language queries. Unlike traditional search libraries that only support keyword matching, nl-search understands context and meaning through natural language processing.

## Features

- 🔍 **Natural Language Queries**: Search using full sentences and phrases, not just keywords
- 🌳 **Multi-level Search**: Traverse deeply nested JSON structures
- 📍 **Parent Tracking**: Returns matching nodes with their complete parent path
- 🎯 **Intelligent Scoring**: Uses multiple NLP algorithms for relevance ranking
- ⚙️ **Configurable**: Customize search behavior with various options
- 📦 **TypeScript Support**: Fully typed for excellent IDE support

## Installation

```bash
npm install nl-search
```

## Browser Usage (Vite, Webpack, etc.)

This package is **fully browser-compatible** and works seamlessly with modern bundlers like Vite, Webpack, and others. Unlike many NLP libraries, nl-search uses pure JavaScript dependencies with no Node.js-specific modules.

### Zero Configuration Required 🎉

Starting from version 1.1.0, this package uses browser-native NLP libraries:
- **compromise** - lightweight NLP for tokenization and stemming
- **@skyra/jaro-winkler** - pure JavaScript string similarity (zero dependencies)

No special bundler configuration needed! Just install and use:

```javascript
import { search } from 'nl-search';

const data = [
  { name: 'John Doe', role: 'Developer' },
  { name: 'Jane Smith', role: 'Designer' }
];

const results = search(data, 'who is a developer?');
```

The package works out of the box in:
- ✅ Vite
- ✅ Webpack
- ✅ Rollup
- ✅ Parcel
- ✅ esbuild
- ✅ Any modern bundler

## Local Development & Testing

If you want to test this package locally without publishing it to the NPM registry, you have several options:

### Option 1: Using npm link (Recommended for Development)

This is the best approach when you're actively developing and want live updates in your test app.

1. In the `nl-search` package directory, build the package and create a global link:
```bash
cd /path/to/nl-search
npm install
npm run build
npm link
```

2. In your test application directory, link to the package:
```bash
cd /path/to/your-test-app
npm link nl-search
```

3. Now you can use the package in your test app:
```javascript
import { search } from 'nl-search';
```

4. When you make changes to `nl-search`, just rebuild:
```bash
cd /path/to/nl-search
npm run build
# Changes are automatically available in your test app
```

5. To unlink when you're done:
```bash
cd /path/to/your-test-app
npm unlink nl-search

cd /path/to/nl-search
npm unlink
```

### Option 2: Using npm pack

This method creates a tarball that you can install like a published package.

1. In the `nl-search` directory, build and create a tarball:
```bash
cd /path/to/nl-search
npm install
npm run build
npm pack
```

This creates a file like `nl-search-<version>.tgz` (e.g., `nl-search-1.0.0.tgz`) in the current directory.

2. In your test application, install the tarball:
```bash
cd /path/to/your-test-app
npm install /path/to/nl-search/nl-search-*.tgz
```

3. Use the package normally:
```javascript
import { search } from 'nl-search';
```

**Note:** You need to run `npm pack` and reinstall every time you make changes.

### Option 3: Direct File Path Installation

You can install directly from the local file path.

1. Build the package:
```bash
cd /path/to/nl-search
npm install
npm run build
```

2. In your test application, install using the file path:
```bash
cd /path/to/your-test-app
npm install /path/to/nl-search
```

Or add it to your `package.json`:
```json
{
  "dependencies": {
    "nl-search": "file:../nl-search"
  }
}
```

Then run `npm install`.

**Note:** Like npm pack, you need to rebuild and reinstall after changes.

### Running the Examples

The package includes example files that demonstrate usage:

```bash
cd /path/to/nl-search
npm install
npm run build
node examples/demo.js
node examples/usage.js
```

These examples show various natural language queries and search patterns.

### Testing Your Changes

Before using the package in your application, always run the tests:

```bash
npm test
```

To lint your code:

```bash
npm run lint
```

## Quick Start

```javascript
import { search } from 'nl-search';

const data = [
  {
    id: 1,
    name: 'John Doe',
    role: 'Software Engineer',
    skills: ['JavaScript', 'TypeScript', 'React']
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'Product Manager',
    skills: ['Product Strategy', 'User Research']
  }
];

// Natural language search
const results = search(data, 'who is a software engineer?');

console.log(results);
// Returns matching nodes with their paths and parent information
```

## Usage

### Basic Search

```javascript
import { search, NLSearch } from 'nl-search';

// Using the convenience function
const results = search(data, 'find people who work in engineering');

// Or create a reusable instance
const searcher = new NLSearch();
const results = searcher.search(data, 'projects that are in progress');
```

### Natural Language Queries

The package understands natural language, not just keywords:

```javascript
// These all work naturally:
search(data, 'show me all engineers');
search(data, 'who works in the marketing department?');
search(data, 'find projects that are completed');
search(data, 'people with machine learning skills');
```

### Search Options

```javascript
import { search, SearchOptions } from 'nl-search';

const options: SearchOptions = {
  minScore: 0.5,      // Minimum relevance score (0-1)
  maxResults: 10,     // Limit number of results
  searchKeys: true,   // Search object keys as well as values
  caseSensitive: false // Case-sensitive search
};

const results = search(data, 'engineering', options);
```

### Understanding Results

Each result contains:

```javascript
{
  node: any,        // The matching JSON node
  path: string[],   // Path to the node (e.g., ['users', '[0]', 'name'])
  parents: any[],   // Array of parent nodes
  score: number     // Relevance score (0-1)
}
```

Example:

```javascript
const data = {
  departments: [
    {
      name: 'Engineering',
      teams: [
        { name: 'Frontend', members: ['Alice', 'Bob'] }
      ]
    }
  ]
};

const results = search(data, 'frontend team');

// Result might look like:
// {
//   node: { name: 'Frontend', members: ['Alice', 'Bob'] },
//   path: ['departments', '[0]', 'teams', '[0]'],
//   parents: [
//     { departments: [...] },
//     [ { name: 'Engineering', teams: [...] } ],
//     { name: 'Engineering', teams: [...] },
//     [ { name: 'Frontend', members: [...] } ]
//   ],
//   score: 0.87
// }
```

## How It Works

nl-search uses multiple NLP techniques powered by browser-compatible libraries:

1. **Tokenization**: Breaks queries and content into words using [compromise](https://github.com/spencermountain/compromise)
2. **Stemming**: Reduces words to their root form (e.g., "running" → "run") using compromise's normalization
3. **Similarity Scoring**: Uses algorithms like:
   - Exact phrase matching
   - Jaro-Winkler distance (via [@skyra/jaro-winkler](https://github.com/skyra-project/jaro-winkler))
   - Token overlap analysis
   - Dice coefficient

Results are ranked by relevance, with exact matches scoring highest.

All libraries are pure JavaScript with zero Node.js dependencies, ensuring full browser compatibility.

## Examples

### Searching Nested Data

```javascript
const employees = [
  {
    name: 'Alice Johnson',
    department: 'Engineering',
    projects: [
      { name: 'Mobile App', status: 'in progress', priority: 'high' },
      { name: 'Website Redesign', status: 'completed', priority: 'medium' }
    ]
  },
  {
    name: 'Bob Smith',
    department: 'Sales',
    projects: [
      { name: 'Q4 Campaign', status: 'in progress', priority: 'high' }
    ]
  }
];

// Find high priority projects
const results = search(employees, 'high priority projects');

// Find completed work
const completed = search(employees, 'what has been completed?');

// Find specific people
const alice = search(employees, 'alice from engineering');
```

### Complex Queries

```javascript
const products = [
  {
    category: 'Electronics',
    items: [
      { name: 'Laptop', price: 999, inStock: true },
      { name: 'Smartphone', price: 699, inStock: false }
    ]
  },
  {
    category: 'Books',
    items: [
      { name: 'JavaScript Guide', price: 39, inStock: true },
      { name: 'Python Basics', price: 29, inStock: true }
    ]
  }
];

// Natural language queries
search(products, 'electronics that are available');
search(products, 'books about programming');
search(products, 'items under 50 dollars');
```

## API Reference

### `search(data, query, options?)`

Convenience function to search without creating an instance.

**Parameters:**
- `data`: any - The data structure to search
- `query`: string - Natural language query
- `options?`: SearchOptions - Optional configuration

**Returns:** SearchResult[]

### `class NLSearch`

Main search class.

#### `constructor()`

Creates a new NLSearch instance.

#### `search(data, query, options?)`

Performs a natural language search.

**Parameters:**
- `data`: any - The data structure to search
- `query`: string - Natural language query
- `options?`: SearchOptions - Optional configuration

**Returns:** SearchResult[]

### Types

#### `SearchOptions`

```typescript
interface SearchOptions {
  minScore?: number;        // Default: 0.3
  maxResults?: number;      // Default: Infinity
  searchKeys?: boolean;     // Default: true
  caseSensitive?: boolean;  // Default: false
}
```

#### `SearchResult`

```typescript
interface SearchResult {
  node: any;
  path: string[];
  parents: any[];
  score: number;
}
```

## Performance Considerations

- The search traverses the entire data structure, so performance depends on data size
- For large datasets, consider using `maxResults` to limit returned results
- Adjust `minScore` to filter out low-quality matches
- The library is optimized for datasets with thousands of nodes

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
