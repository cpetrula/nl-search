const { search } = require('../dist/index');

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║     Natural Language JSON Search - Demo                   ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Create a realistic dataset
const employeeDatabase = [
  {
    id: 1,
    name: 'Alice Johnson',
    role: 'Senior Software Engineer',
    department: 'Engineering',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
    location: 'San Francisco',
    projects: [
      { name: 'E-commerce Platform', status: 'completed', priority: 'high' },
      { name: 'Mobile App Development', status: 'in progress', priority: 'high' }
    ]
  },
  {
    id: 2,
    name: 'Bob Smith',
    role: 'Product Manager',
    department: 'Product',
    skills: ['Product Strategy', 'User Research', 'Roadmap Planning'],
    location: 'New York',
    projects: [
      { name: 'Customer Analytics Dashboard', status: 'completed', priority: 'medium' }
    ]
  },
  {
    id: 3,
    name: 'Carol Davis',
    role: 'Data Scientist',
    department: 'Engineering',
    skills: ['Python', 'Machine Learning', 'Data Analysis'],
    location: 'Austin',
    projects: [
      { name: 'AI Recommendation Engine', status: 'in progress', priority: 'high' }
    ]
  }
];

// Demonstrate natural language queries
const queries = [
  'who works in engineering?',
  'show me people with machine learning skills',
  'which projects are currently in progress?',
  'find employees in San Francisco',
  'what has been completed?'
];

queries.forEach(query => {
  console.log(`\n🔍 Query: "${query}"`);
  console.log('─'.repeat(60));
  
  const results = search(employeeDatabase, query, { maxResults: 3, minScore: 0.30 });
  
  if (results.length === 0) {
    console.log('   No results found');
  } else {
    results.forEach((result, index) => {
      console.log(`\n   ${index + 1}. Relevance Score: ${(result.score * 100).toFixed(1)}%`);
      
      // Display the matched node in a readable format
      if (result.node.name && result.node.role) {
        // It's an employee
        console.log(`      Employee: ${result.node.name}`);
        console.log(`      Role: ${result.node.role}`);
        console.log(`      Department: ${result.node.department}`);
      } else if (result.node.name && result.node.status) {
        // It's a project
        console.log(`      Project: ${result.node.name}`);
        console.log(`      Status: ${result.node.status}`);
        console.log(`      Priority: ${result.node.priority}`);
      } else if (typeof result.node === 'string') {
        console.log(`      Value: "${result.node}"`);
      } else {
        // Generic object
        const preview = JSON.stringify(result.node).substring(0, 80);
        console.log(`      Data: ${preview}${preview.length >= 80 ? '...' : ''}`);
      }
      
      console.log(`      Path: ${result.path.join(' → ') || 'root'}`);
    });
  }
});

console.log('\n\n╔════════════════════════════════════════════════════════════╗');
console.log('║     Demo Complete - Natural Language Search Works!        ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');
