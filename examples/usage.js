import { search } from '../dist/index.js';

// Example 1: Employee Database
console.log('=== Example 1: Employee Database ===\n');

const employees = [
  {
    id: 1,
    name: 'Alice Johnson',
    role: 'Senior Software Engineer',
    department: 'Engineering',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
    projects: [
      { name: 'E-commerce Platform', status: 'completed', priority: 'high' },
      { name: 'Mobile App', status: 'in progress', priority: 'high' }
    ],
    location: 'San Francisco'
  },
  {
    id: 2,
    name: 'Bob Smith',
    role: 'Product Manager',
    department: 'Product',
    skills: ['Product Strategy', 'Roadmap Planning', 'User Research'],
    projects: [
      { name: 'Customer Analytics Dashboard', status: 'completed', priority: 'medium' }
    ],
    location: 'New York'
  },
  {
    id: 3,
    name: 'Carol Davis',
    role: 'Data Scientist',
    department: 'Engineering',
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL'],
    projects: [
      { name: 'AI Recommendation Engine', status: 'in progress', priority: 'high' },
      { name: 'Data Pipeline Optimization', status: 'planning', priority: 'medium' }
    ],
    location: 'Austin'
  }
];

// Natural language query 1
console.log('Query: "who works in engineering?"');
let results = search(employees, 'who works in engineering?', { maxResults: 5 });
results.forEach(r => {
  console.log(`  - Score: ${r.score.toFixed(2)}, Node:`, r.node.name || r.node.department || JSON.stringify(r.node).substring(0, 50));
});
console.log();

// Natural language query 2
console.log('Query: "show me people with machine learning skills"');
results = search(employees, 'show me people with machine learning skills', { maxResults: 5 });
results.forEach(r => {
  if (r.node.name) {
    console.log(`  - Score: ${r.score.toFixed(2)}, Employee: ${r.node.name}`);
  }
});
console.log();

// Natural language query 3
console.log('Query: "projects that are in progress"');
results = search(employees, 'projects that are in progress', { maxResults: 5 });
results.forEach(r => {
  if (r.node.name && r.node.status) {
    console.log(`  - Score: ${r.score.toFixed(2)}, Project: ${r.node.name}, Status: ${r.node.status}`);
  }
});
console.log();

// Example 2: Product Catalog
console.log('=== Example 2: Product Catalog ===\n');

const catalog = {
  categories: [
    {
      name: 'Electronics',
      products: [
        { id: 101, name: 'Laptop Pro 15', price: 1299, inStock: true, features: ['16GB RAM', '512GB SSD'] },
        { id: 102, name: 'Wireless Mouse', price: 29, inStock: false, features: ['Bluetooth', 'Ergonomic'] },
        { id: 103, name: 'USB-C Hub', price: 49, inStock: true, features: ['7 Ports', 'Fast Charging'] }
      ]
    },
    {
      name: 'Books',
      products: [
        { id: 201, name: 'JavaScript: The Good Parts', price: 35, inStock: true, author: 'Douglas Crockford' },
        { id: 202, name: 'Clean Code', price: 42, inStock: true, author: 'Robert Martin' },
        { id: 203, name: 'Design Patterns', price: 54, inStock: false, author: 'Gang of Four' }
      ]
    }
  ]
};

// Query with natural language
console.log('Query: "books about programming that are available"');
results = search(catalog, 'books about programming that are available', { maxResults: 5 });
results.forEach(r => {
  if (r.node.name && r.node.price) {
    console.log(`  - Score: ${r.score.toFixed(2)}, Product: ${r.node.name}, Price: $${r.node.price}`);
  }
});
console.log();

// Example 3: Parent Path Tracking
console.log('=== Example 3: Parent Path Tracking ===\n');

const organization = {
  company: 'TechCorp',
  divisions: [
    {
      name: 'West Coast',
      offices: [
        {
          city: 'San Francisco',
          teams: [
            { name: 'Frontend', lead: 'Sarah Connor', size: 8 },
            { name: 'Backend', lead: 'John Doe', size: 10 }
          ]
        }
      ]
    }
  ]
};

console.log('Query: "frontend team"');
results = search(organization, 'frontend team', { maxResults: 1 });
if (results.length > 0) {
  const result = results[0];
  console.log('  Matched Node:', result.node);
  console.log('  Path:', result.path.join(' > '));
  console.log('  Number of Parents:', result.parents.length);
  console.log('  Score:', result.score.toFixed(2));
}
console.log();

// Example 4: Adjusting Search Sensitivity
console.log('=== Example 4: Search Sensitivity ===\n');

const testData = [
  { id: 1, description: 'Natural language processing techniques' },
  { id: 2, description: 'Machine learning algorithms' },
  { id: 3, description: 'Data structures and algorithms' }
];

console.log('Query: "algorithms" with minScore: 0.5 (strict)');
results = search(testData, 'algorithms', { minScore: 0.5 });
console.log(`  Found ${results.length} results`);

console.log('Query: "algorithms" with minScore: 0.2 (lenient)');
results = search(testData, 'algorithms', { minScore: 0.2 });
console.log(`  Found ${results.length} results`);
console.log();

console.log('=== Examples Complete ===');
