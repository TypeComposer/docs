#!/usr/bin/env node

/**
 * Algolia Documentation Indexer
 * 
 * This script indexes MDX documentation files to Algolia for search functionality.
 * 
 * Usage:
 * 1. Install dependencies: npm install algoliasearch
 * 2. Set environment variables:
 *    - ALGOLIA_APP_ID
 *    - ALGOLIA_ADMIN_API_KEY (use Admin API Key, not Search-Only)
 *    - ALGOLIA_INDEX_NAME
 * 3. Run: node scripts/index-algolia.js
 */

import algoliasearch from 'algoliasearch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.URL);
const __dirname = path.dirname(__filename);

// Algolia configuration from environment variables
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY;
const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME || 'typecomposer_docs';

if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_API_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   - ALGOLIA_APP_ID');
  console.error('   - ALGOLIA_ADMIN_API_KEY');
  console.error('\nPlease set these environment variables and try again.');
  process.exit(1);
}

// Initialize Algolia client
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY);
const index = client.initIndex(ALGOLIA_INDEX_NAME);

/**
 * Extract title from MDX content
 */
function extractTitle(content) {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  return titleMatch ? titleMatch[1].trim() : 'Untitled';
}

/**
 * Extract plain text content from MDX
 */
function extractContent(content) {
  // Remove MDX/MD syntax and code blocks
  let text = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/^#+\s+/gm, '') // Remove headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
    .replace(/[*_~`]/g, '') // Remove formatting
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();
  
  // Limit content length for better search results
  if (text.length > 500) {
    text = text.substring(0, 500) + '...';
  }
  
  return text;
}

/**
 * Extract headings structure from MDX
 */
function extractHierarchy(content) {
  const headings = content.match(/^#+\s+.+$/gm) || [];
  return headings.map(h => {
    const level = h.match(/^#+/)[0].length;
    const text = h.replace(/^#+\s+/, '').trim();
    return { level, text };
  });
}

/**
 * Recursively read all MDX files from a directory
 */
function getMDXFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getMDXFiles(filePath, fileList);
    } else if (file.endsWith('.mdx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Process MDX files and create Algolia records
 */
async function indexDocumentation() {
  console.log('🔍 Starting documentation indexing...\n');
  
  const contentDir = path.join(__dirname, '..', 'content');
  const mdxFiles = getMDXFiles(contentDir);
  
  console.log(`📚 Found ${mdxFiles.length} MDX files\n`);
  
  const records = [];
  
  mdxFiles.forEach((filePath, index) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(contentDir, filePath);
    const docPath = relativePath.replace('.mdx', '').toLowerCase();
    
    const title = extractTitle(content);
    const textContent = extractContent(content);
    const hierarchy = extractHierarchy(content);
    
    records.push({
      objectID: docPath,
      title,
      content: textContent,
      path: docPath,
      hierarchy: hierarchy,
      url: `#/docs/${docPath}`,
    });
    
    console.log(`  ✓ Processed: ${relativePath}`);
  });
  
  console.log('\n📤 Uploading records to Algolia...\n');
  
  try {
    // Clear existing records
    await index.clearObjects();
    console.log('  ✓ Cleared existing index');
    
    // Upload new records
    const { objectIDs } = await index.saveObjects(records);
    console.log(`  ✓ Uploaded ${objectIDs.length} records`);
    
    // Configure index settings
    await index.setSettings({
      searchableAttributes: [
        'title',
        'hierarchy.text',
        'content',
      ],
      attributesToHighlight: ['title', 'content'],
      attributesToSnippet: ['content:30'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
    });
    console.log('  ✓ Configured index settings');
    
    console.log('\n✅ Indexing complete!\n');
    console.log(`   Index name: ${ALGOLIA_INDEX_NAME}`);
    console.log(`   Total records: ${objectIDs.length}\n`);
    
  } catch (error) {
    console.error('❌ Error indexing documentation:', error.message);
    process.exit(1);
  }
}

// Run indexing
indexDocumentation().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
