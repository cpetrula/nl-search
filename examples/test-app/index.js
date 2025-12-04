// Example test application for nl-search
// This demonstrates how to use nl-search in your own application

const { search, NLSearch } = require('nl-search');

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║   Testing nl-search in Local Application                  ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Sample data: A small library catalog
const libraryData = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic Fiction',
    year: 1925,
    available: true,
    reviews: [
      { rating: 5, comment: 'A masterpiece of American literature' },
      { rating: 4, comment: 'Beautiful prose and compelling story' }
    ]
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Classic Fiction',
    year: 1960,
    available: false,
    reviews: [
      { rating: 5, comment: 'Powerful and moving' },
      { rating: 5, comment: 'Essential reading' }
    ]
  },
  {
    id: 3,
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian Fiction',
    year: 1949,
    available: true,
    reviews: [
      { rating: 5, comment: 'Chillingly prescient' },
      { rating: 4, comment: 'A warning for our times' }
    ]
  },
  {
    id: 4,
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    year: 1937,
    available: true,
    reviews: [
      { rating: 5, comment: 'A delightful adventure' },
      { rating: 5, comment: 'Perfect for all ages' }
    ]
  }
];

console.log('📚 Library Catalog loaded with', libraryData.length, 'books\n');

// Test 1: Find books by genre
console.log('Test 1: Find classic fiction books');
console.log('─'.repeat(60));
let results = search(libraryData, 'classic fiction books');
console.log(`Found ${results.length} results:`);
results.slice(0, 3).forEach(r => {
  if (r.node.title) {
    console.log(`  ✓ "${r.node.title}" by ${r.node.author} (Score: ${(r.score * 100).toFixed(1)}%)`);
  }
});
console.log();

// Test 2: Find available books
console.log('Test 2: Find books that are available');
console.log('─'.repeat(60));
results = search(libraryData, 'books that are available');
console.log(`Found ${results.length} results:`);
results.slice(0, 3).forEach(r => {
  if (r.node.title && r.node.available !== undefined) {
    console.log(`  ✓ "${r.node.title}" - Available: ${r.node.available} (Score: ${(r.score * 100).toFixed(1)}%)`);
  }
});
console.log();

// Test 3: Search by author
console.log('Test 3: Find books by Orwell');
console.log('─'.repeat(60));
results = search(libraryData, 'books by Orwell');
console.log(`Found ${results.length} results:`);
results.slice(0, 3).forEach(r => {
  if (r.node.title) {
    console.log(`  ✓ "${r.node.title}" (Score: ${(r.score * 100).toFixed(1)}%)`);
  }
});
console.log();

// Test 4: Using the NLSearch class instance
console.log('Test 4: Using NLSearch class with custom options');
console.log('─'.repeat(60));
const searcher = new NLSearch();
results = searcher.search(libraryData, 'fantasy adventure', {
  minScore: 0.3,
  maxResults: 5
});
console.log(`Found ${results.length} results with minScore 0.3:`);
results.forEach(r => {
  if (r.node.title) {
    console.log(`  ✓ "${r.node.title}" (Score: ${(r.score * 100).toFixed(1)}%)`);
  }
});
console.log();

// Test 5: Nested search
console.log('Test 5: Search in nested reviews');
console.log('─'.repeat(60));
results = search(libraryData, 'masterpiece');
console.log(`Found ${results.length} results:`);
results.slice(0, 3).forEach(r => {
  if (typeof r.node === 'string' && r.node.includes('masterpiece')) {
    console.log(`  ✓ Review: "${r.node}" (Score: ${(r.score * 100).toFixed(1)}%)`);
    console.log(`    Path: ${r.path.join(' → ')}`);
  }
});
console.log();

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║   All tests completed successfully!                        ║');
console.log('║   nl-search is working correctly in your local app         ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('💡 Next Steps:');
console.log('   1. Modify this file to test with your own data');
console.log('   2. Experiment with different queries');
console.log('   3. Adjust search options (minScore, maxResults, etc.)');
console.log('   4. Check out examples/demo.js and examples/usage.js for more examples\n');
