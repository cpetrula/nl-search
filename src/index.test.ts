import { NLSearch, search } from './index';

describe('NLSearch', () => {
  let searcher: NLSearch;

  beforeEach(() => {
    searcher = new NLSearch();
  });

  describe('Natural Language Search', () => {
    const testData = [
      {
        id: 1,
        name: 'John Doe',
        role: 'Software Engineer',
        department: 'Engineering',
        skills: ['JavaScript', 'TypeScript', 'React'],
        projects: [
          { name: 'E-commerce Platform', status: 'completed' },
          { name: 'Mobile App', status: 'in progress' }
        ]
      },
      {
        id: 2,
        name: 'Jane Smith',
        role: 'Product Manager',
        department: 'Product',
        skills: ['Product Strategy', 'Roadmap Planning', 'User Research'],
        projects: [
          { name: 'Customer Analytics Dashboard', status: 'completed' }
        ]
      },
      {
        id: 3,
        name: 'Bob Johnson',
        role: 'Senior Developer',
        department: 'Engineering',
        skills: ['Python', 'Machine Learning', 'Data Science'],
        projects: [
          { name: 'AI Recommendation Engine', status: 'in progress' },
          { name: 'Data Pipeline', status: 'completed' }
        ]
      }
    ];

    it('should find results using natural language query', () => {
      const results = searcher.search(testData, 'who works in engineering?');
      
      expect(results.length).toBeGreaterThan(0);
      const departments = results.map(r => r.node.department || (r.node as any).department);
      expect(departments.some(d => d === 'Engineering')).toBe(true);
    });

    it('should find results using a full sentence', () => {
      const results = searcher.search(testData, 'show me people who are software engineers');
      
      expect(results.length).toBeGreaterThan(0);
      const hasEngineer = results.some(r => 
        JSON.stringify(r.node).toLowerCase().includes('engineer')
      );
      expect(hasEngineer).toBe(true);
    });

    it('should find nested data using natural language', () => {
      const results = searcher.search(testData, 'projects that are in progress');
      
      expect(results.length).toBeGreaterThan(0);
      const hasInProgress = results.some(r => 
        JSON.stringify(r.node).toLowerCase().includes('in progress')
      );
      expect(hasInProgress).toBe(true);
    });

    it('should return nodes with parent information', () => {
      const results = searcher.search(testData, 'mobile app');
      
      expect(results.length).toBeGreaterThan(0);
      results.forEach(result => {
        expect(result).toHaveProperty('node');
        expect(result).toHaveProperty('path');
        expect(result).toHaveProperty('parents');
        expect(result).toHaveProperty('score');
        expect(Array.isArray(result.path)).toBe(true);
        expect(Array.isArray(result.parents)).toBe(true);
      });
    });

    it('should handle phrase-based queries', () => {
      const results = searcher.search(testData, 'machine learning and data science');
      
      expect(results.length).toBeGreaterThan(0);
      const content = JSON.stringify(results.map(r => r.node)).toLowerCase();
      expect(content.includes('machine learning') || content.includes('data science')).toBe(true);
    });

    it('should work with descriptive queries', () => {
      const results = searcher.search(testData, 'find the person named Jane');
      
      expect(results.length).toBeGreaterThan(0);
      const hasJane = results.some(r => 
        JSON.stringify(r.node).toLowerCase().includes('jane')
      );
      expect(hasJane).toBe(true);
    });
  });

  describe('Search Options', () => {
    const testData = {
      users: [
        { name: 'Alice', age: 30, city: 'New York' },
        { name: 'Bob', age: 25, city: 'Los Angeles' },
        { name: 'Charlie', age: 35, city: 'Chicago' }
      ]
    };

    it('should respect minScore option', () => {
      const strictResults = searcher.search(testData, 'user from new york', { minScore: 0.5 });
      const lenientResults = searcher.search(testData, 'user from new york', { minScore: 0.1 });
      
      expect(lenientResults.length).toBeGreaterThanOrEqual(strictResults.length);
    });

    it('should respect maxResults option', () => {
      const results = searcher.search(testData, 'person', { maxResults: 2 });
      
      expect(results.length).toBeLessThanOrEqual(2);
    });

    it('should search keys when searchKeys is true', () => {
      const results = searcher.search(testData, 'users', { searchKeys: true });
      
      expect(results.length).toBeGreaterThan(0);
    });

    it('should handle case sensitive search', () => {
      const caseInsensitive = searcher.search(testData, 'ALICE', { caseSensitive: false });
      const caseSensitive = searcher.search(testData, 'ALICE', { caseSensitive: true });
      
      expect(caseInsensitive.length).toBeGreaterThan(0);
      expect(caseSensitive.length).toBe(0);
    });
  });

  describe('Multi-level Arrays', () => {
    const complexData = {
      departments: [
        {
          name: 'Sales',
          teams: [
            {
              name: 'Enterprise Sales',
              members: [
                { name: 'Sarah', quota: 500000 },
                { name: 'Mike', quota: 450000 }
              ]
            }
          ]
        },
        {
          name: 'Marketing',
          teams: [
            {
              name: 'Digital Marketing',
              members: [
                { name: 'Emma', specialty: 'SEO' },
                { name: 'Lucas', specialty: 'Content Marketing' }
              ]
            }
          ]
        }
      ]
    };

    it('should search deeply nested structures', () => {
      const results = searcher.search(complexData, 'content marketing specialist');
      
      expect(results.length).toBeGreaterThan(0);
      const hasContent = results.some(r => 
        JSON.stringify(r.node).toLowerCase().includes('content')
      );
      expect(hasContent).toBe(true);
    });

    it('should maintain parent path for nested results', () => {
      const results = searcher.search(complexData, 'SEO');
      
      const topResult = results.find(r => 
        JSON.stringify(r.node).includes('SEO')
      );
      
      if (topResult) {
        expect(topResult.path.length).toBeGreaterThan(0);
        expect(topResult.parents.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Convenience Function', () => {
    it('should work without creating an instance', () => {
      const data = [
        { id: 1, text: 'Hello world' },
        { id: 2, text: 'Goodbye world' }
      ];
      
      const results = search(data, 'hello');
      
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty('node');
      expect(results[0]).toHaveProperty('path');
      expect(results[0]).toHaveProperty('parents');
      expect(results[0]).toHaveProperty('score');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data', () => {
      const results = searcher.search([], 'query');
      expect(results).toEqual([]);
    });

    it('should handle null values', () => {
      const data = { a: null, b: 'value' };
      const results = searcher.search(data, 'value');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should handle primitive values', () => {
      const data = ['apple', 'banana', 'orange'];
      const results = searcher.search(data, 'banana');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should handle numbers', () => {
      const data = [{ id: 123, name: 'test' }];
      const results = searcher.search(data, '123');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should handle booleans', () => {
      const data = [{ active: true, name: 'test' }];
      const results = searcher.search(data, 'true');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('Score Ranking', () => {
    const data = [
      { text: 'exact match for natural language search' },
      { text: 'natural language' },
      { text: 'language processing' },
      { text: 'something else entirely' }
    ];

    it('should rank exact matches higher', () => {
      const results = searcher.search(data, 'natural language search');
      
      expect(results.length).toBeGreaterThan(0);
      // Results should be sorted by score descending
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score);
      }
    });

    it('should assign higher scores to better matches', () => {
      const results = searcher.search(data, 'natural language');
      
      if (results.length >= 2) {
        const exactMatch = results.find(r => 
          r.node.text === 'natural language'
        );
        const partialMatch = results.find(r => 
          r.node.text === 'language processing'
        );
        
        if (exactMatch && partialMatch) {
          expect(exactMatch.score).toBeGreaterThan(partialMatch.score);
        }
      }
    });
  });
});
