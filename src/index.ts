// Import browser-compatible NLP libraries
// compromise: a lightweight NLP library that works in browsers
// @skyra/jaro-winkler: a pure implementation of Jaro-Winkler distance with no dependencies
import nlp from 'compromise';
import { jaroWinkler } from '@skyra/jaro-winkler';

/**
 * Represents a search result with the matched node and its parent path
 */
export interface SearchResult {
  node: any;
  path: string[];
  parents: any[];
  score: number;
}

/**
 * Configuration options for the search
 */
export interface SearchOptions {
  /**
   * Minimum similarity score (0-1) to consider a match
   * Default: 0.3
   */
  minScore?: number;
  
  /**
   * Maximum number of results to return
   * Default: Infinity (all matches)
   */
  maxResults?: number;
  
  /**
   * Whether to search in keys as well as values
   * Default: true
   */
  searchKeys?: boolean;
  
  /**
   * Case sensitive search
   * Default: false
   */
  caseSensitive?: boolean;
}

/**
 * Natural Language Search for JSON objects
 */
export class NLSearch {
  constructor() {
    // No initialization needed - compromise is used directly
  }

  /**
   * Tokenize text into words using compromise
   */
  private tokenize(text: string): string[] {
    const doc = nlp(text);
    // Use text() method which strips punctuation
    const tokens: string[] = [];
    doc.terms().forEach((term: any) => {
      tokens.push(term.text());
    });
    return tokens;
  }

  /**
   * Stem a word using compromise's normalization
   * This reduces words to their root form (e.g., "running" -> "run")
   */
  private stem(word: string): string {
    const doc = nlp(word);
    // Use normalized form which handles verb infinitives and noun singulars
    return doc.terms().out('normal');
  }

  /**
   * Search through a multi-level array of JSON objects using natural language
   * @param data - The data structure to search (array or object)
   * @param query - Natural language query
   * @param options - Search configuration options
   * @returns Array of search results with matching nodes and their parents
   */
  search(data: any, query: string, options: SearchOptions = {}): SearchResult[] {
    const {
      minScore = 0.3,
      maxResults = Infinity,
      searchKeys = true,
      caseSensitive = false
    } = options;

    // Normalize query if case insensitive
    const normalizedQuery = caseSensitive ? query : query.toLowerCase();
    
    // Tokenize the query
    const queryTokens = this.tokenize(normalizedQuery);
    // Only stem if case insensitive (stemming normalizes case)
    const stemmedQuery = caseSensitive 
      ? queryTokens 
      : queryTokens.map(token => this.stem(token));

    const results: SearchResult[] = [];
    
    // Traverse the data structure
    this.traverse(data, [], [], normalizedQuery, stemmedQuery, results, {
      minScore,
      searchKeys,
      caseSensitive
    });

    // Sort by score (descending) and limit results
    results.sort((a, b) => b.score - a.score);
    
    return results.slice(0, maxResults);
  }

  /**
   * Recursively traverse the data structure
   */
  private traverse(
    current: any,
    path: string[],
    parents: any[],
    query: string,
    stemmedQuery: string[],
    results: SearchResult[],
    options: Required<Pick<SearchOptions, 'minScore' | 'searchKeys' | 'caseSensitive'>>
  ): void {
    if (current === null || current === undefined) {
      return;
    }

    // Calculate relevance score for current node
    const score = this.calculateRelevance(current, query, stemmedQuery, options);
    
    if (score >= options.minScore) {
      results.push({
        node: current,
        path: [...path],
        parents: [...parents],
        score
      });
    }

    // Traverse arrays
    if (Array.isArray(current)) {
      current.forEach((item, index) => {
        this.traverse(
          item,
          [...path, `[${index}]`],
          [...parents, current],
          query,
          stemmedQuery,
          results,
          options
        );
      });
    }
    // Traverse objects
    else if (typeof current === 'object') {
      Object.keys(current).forEach(key => {
        this.traverse(
          current[key],
          [...path, key],
          [...parents, current],
          query,
          stemmedQuery,
          results,
          options
        );
      });
    }
  }

  /**
   * Calculate relevance score between the query and a node
   */
  private calculateRelevance(
    node: any,
    query: string,
    stemmedQuery: string[],
    options: Required<Pick<SearchOptions, 'searchKeys' | 'caseSensitive'>>
  ): number {
    const textContent = this.extractTextContent(node, options.searchKeys, options.caseSensitive);
    
    if (!textContent || textContent.length === 0) {
      return 0;
    }

    const normalizedContent = options.caseSensitive ? textContent : textContent.toLowerCase();
    
    // Calculate different similarity metrics
    const scores: number[] = [];

    // 1. Exact phrase match (highest weight)
    if (normalizedContent.includes(query)) {
      scores.push(1.0);
    }

    // 2. Jaro-Winkler distance for overall similarity
    const jaroScore = jaroWinkler(query, normalizedContent);
    scores.push(jaroScore);

    // 3. Token-based similarity using TF-IDF concepts
    const contentTokens = this.tokenize(normalizedContent);
    // Only stem if case insensitive
    const stemmedContent = options.caseSensitive
      ? contentTokens
      : contentTokens.map(token => this.stem(token));
    
    // Calculate token overlap
    const matchingTokens = stemmedQuery.filter(qToken => 
      stemmedContent.some(cToken => cToken === qToken)
    );
    const tokenScore = stemmedQuery.length > 0 
      ? matchingTokens.length / stemmedQuery.length 
      : 0;
    scores.push(tokenScore);

    // 4. Dice coefficient for word-level similarity
    const diceScore = this.diceCoefficient(stemmedQuery, stemmedContent);
    scores.push(diceScore);

    // Weighted average of all scores
    // Weights depend on whether we have an exact match
    const hasExactMatch = scores.length === 4;
    const weights = hasExactMatch
      ? [0.4, 0.2, 0.3, 0.1]  // [exact, jaro, token, dice]
      : [0.3, 0.4, 0.3];       // [jaro, token, dice]

    let weightedScore = 0;
    scores.forEach((score, index) => {
      weightedScore += score * weights[index];
    });

    return weightedScore;
  }

  /**
   * Extract searchable text content from a node
   */
  private extractTextContent(node: any, searchKeys: boolean, caseSensitive: boolean, depth: number = 0): string {
    // Limit recursion depth to prevent stack overflow
    const MAX_DEPTH = 50;
    if (depth > MAX_DEPTH) {
      return '';
    }

    const parts: string[] = [];

    if (typeof node === 'string') {
      parts.push(node);
    } else if (typeof node === 'number' || typeof node === 'boolean') {
      parts.push(String(node));
    } else if (typeof node === 'object' && node !== null) {
      if (Array.isArray(node)) {
        // For arrays, extract text from all elements
        node.forEach(item => {
          const text = this.extractTextContent(item, searchKeys, caseSensitive, depth + 1);
          if (text) parts.push(text);
        });
      } else {
        // For objects, extract values and optionally keys
        Object.entries(node).forEach(([key, value]) => {
          if (searchKeys) {
            parts.push(key);
          }
          // Recursively extract from nested objects and arrays
          const text = this.extractTextContent(value, false, caseSensitive, depth + 1);
          if (text) parts.push(text);
        });
      }
    }

    return parts.join(' ');
  }

  /**
   * Calculate Dice coefficient between two token arrays
   */
  private diceCoefficient(tokens1: string[], tokens2: string[]): number {
    if (tokens1.length === 0 || tokens2.length === 0) {
      return 0;
    }

    const set1 = new Set(tokens1);
    const set2 = new Set(tokens2);
    
    let intersection = 0;
    set1.forEach(token => {
      if (set2.has(token)) {
        intersection++;
      }
    });

    return (2 * intersection) / (set1.size + set2.size);
  }
}

/**
 * Convenience function to search without creating an instance
 */
export function search(data: any, query: string, options?: SearchOptions): SearchResult[] {
  const searcher = new NLSearch();
  return searcher.search(data, query, options);
}

export default NLSearch;
