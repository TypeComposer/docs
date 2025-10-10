# Algolia InstantSearch Integration

This documentation provides instructions for setting up and configuring Algolia InstantSearch for the TypeComposer documentation.

## Overview

The TypeComposer docs now include Algolia InstantSearch for fast and relevant search functionality. The search is accessible through:

- **Search button** in the navigation bar
- **Keyboard shortcut**: `⌘K` (Mac) or `Ctrl+K` (Windows/Linux)
- **ESC key** to close the search modal

## Configuration

### 1. Algolia Account Setup

1. Create an account at [Algolia](https://www.algolia.com/)
2. Create a new application or use an existing one
3. Create a new index for your documentation (e.g., `typecomposer_docs`)

### 2. Update Algolia Credentials

Update the following constants in `/src/components/search/AlgoliaSearch.ts`:

```typescript
const ALGOLIA_APP_ID = "YOUR_APP_ID"; // Replace with your Algolia Application ID
const ALGOLIA_SEARCH_API_KEY = "YOUR_SEARCH_API_KEY"; // Replace with your Search-Only API Key
const ALGOLIA_INDEX_NAME = "typecomposer_docs"; // Replace with your index name
```

**Important**: Use the **Search-Only API Key** (not the Admin API Key) for client-side searches.

### 3. Index Your Documentation

To make your documentation searchable, you need to index it in Algolia. There are several ways to do this:

#### Option A: Using Algolia Crawler (Recommended)

1. Go to your Algolia dashboard
2. Navigate to **Data sources** > **Crawler**
3. Create a new crawler with your website URL
4. Configure the crawler to extract:
   - `title` - Page title
   - `content` - Page content/text
   - `path` - Document path for navigation
   - `hierarchy` - Document structure (h1, h2, h3, etc.)

#### Option B: Using Algolia DocSearch (For Open Source)

If your project is open source and publicly available, you can apply for [Algolia DocSearch](https://docsearch.algolia.com/) which provides free search for documentation.

#### Option C: Manual Indexing

You can create a script to manually index your MDX content:

```javascript
import algoliasearch from 'algoliasearch';
import fs from 'fs';
import path from 'path';

const client = algoliasearch('YOUR_APP_ID', 'YOUR_ADMIN_API_KEY');
const index = client.initIndex('typecomposer_docs');

// Read and parse your MDX files
const contentDir = './content';
const records = [];

// Process each MDX file
fs.readdirSync(contentDir, { recursive: true }).forEach(file => {
  if (file.endsWith('.mdx')) {
    const content = fs.readFileSync(path.join(contentDir, file), 'utf-8');
    
    records.push({
      objectID: file,
      title: extractTitle(content),
      content: extractContent(content),
      path: file.replace('.mdx', '').replace('/content', '/docs'),
    });
  }
});

// Upload to Algolia
index.saveObjects(records);
```

## Search Configuration

### Customizing Search Behavior

The search is configured in `/src/components/search/AlgoliaSearch.ts`. You can customize:

- **Number of results**: Change `hitsPerPage` in the `configure` widget
- **Search attributes**: Modify the `searchableAttributes` in your Algolia index settings
- **Faceting**: Add filters for categories, tags, etc.

### Customizing Search UI

The search styles are defined in `/src/components/search/search.scss`. You can customize:

- Modal appearance and positioning
- Search input styling
- Results display format
- Colors to match your theme

### Search Result Template

The search results template is configured in the `hits` widget:

```typescript
templates: {
  item: (hit: any, { html, components }: any) => html`
    <a href="${`#/docs/${hit.path}`}" class="hit-link">
      <div class="hit-title">${components.Highlight({ hit, attribute: "title" })}</div>
      <div class="hit-content">${components.Snippet({ hit, attribute: "content" })}</div>
    </a>
  `,
}
```

Customize this template to change how search results are displayed.

## Features

### Current Features

- ✅ InstantSearch integration with Algolia
- ✅ Modal-based search interface
- ✅ Keyboard shortcuts (⌘K / Ctrl+K)
- ✅ Highlighted search terms
- ✅ Content snippets in results
- ✅ Responsive design
- ✅ Theme-aware styling (dark/light mode)

### Planned Enhancements

- 🔄 Autocomplete suggestions
- 🔄 Search filters (by category, type)
- 🔄 Recent searches
- 🔄 Keyboard navigation in results

## Troubleshooting

### Search Not Working

1. **Check credentials**: Ensure `ALGOLIA_APP_ID`, `ALGOLIA_SEARCH_API_KEY`, and `ALGOLIA_INDEX_NAME` are correct
2. **Verify index**: Make sure your Algolia index contains records
3. **Check browser console**: Look for error messages
4. **API Key permissions**: Ensure the Search-Only API Key has the correct permissions

### No Results Found

1. **Index is empty**: Index your documentation content
2. **Attribute configuration**: Ensure `searchableAttributes` in Algolia includes `title` and `content`
3. **Path format**: Verify the `path` field in your records matches the expected format

### Styling Issues

1. **Theme variables**: Ensure CSS variables are defined in `/src/styles/style.scss`
2. **Import order**: Check that search styles are imported after base styles
3. **Specificity**: Some styles may need `!important` to override defaults

## Resources

- [Algolia InstantSearch Documentation](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/js/)
- [Algolia Dashboard](https://www.algolia.com/dashboard)
- [DocSearch Program](https://docsearch.algolia.com/)
- [Algolia API Reference](https://www.algolia.com/doc/api-reference/)

## Support

For issues or questions:

1. Check the [Algolia community forum](https://discourse.algolia.com/)
2. Review [InstantSearch issues on GitHub](https://github.com/algolia/instantsearch/issues)
3. Open an issue in the TypeComposer docs repository
