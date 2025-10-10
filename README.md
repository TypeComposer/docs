# TypeComposer Documentation

Official documentation for [TypeComposer](https://github.com/typecomposer/typecomposer) - a framework for building web and native user interfaces.

## Features

- 📚 Comprehensive documentation for TypeComposer framework
- 🔍 **Fast search powered by Algolia InstantSearch**
- 🎨 Dark/Light theme support
- 📱 Responsive design
- 💻 Interactive playground
- 🎯 Component examples and API reference

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/TypeComposer/docs.git
cd docs

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Search Setup

This documentation includes Algolia InstantSearch for fast and relevant search functionality. See [ALGOLIA_SETUP.md](./ALGOLIA_SETUP.md) for detailed setup instructions.

### Quick Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Algolia credentials:
   ```env
   ALGOLIA_APP_ID=your_app_id
   ALGOLIA_SEARCH_API_KEY=your_search_api_key
   ALGOLIA_INDEX_NAME=typecomposer_docs
   ```

3. Update credentials in `/src/components/search/AlgoliaSearch.ts`

4. Index your documentation:
   ```bash
   node scripts/index-algolia.js
   ```

### Using Search

- Click the search icon in the navigation bar
- Or use keyboard shortcut: `⌘K` (Mac) or `Ctrl+K` (Windows/Linux)
- Press `ESC` to close the search modal

## Project Structure

```
docs/
├── content/           # MDX documentation files
│   ├── components/    # Component documentation
│   ├── elements/      # Element documentation
│   └── layout/        # Layout documentation
├── src/
│   ├── components/    # UI components
│   │   ├── navbar/    # Navigation bar
│   │   ├── sidebar/   # Sidebar navigation
│   │   └── search/    # Algolia search components
│   ├── pages/         # Page components
│   ├── styles/        # Global styles
│   └── utils/         # Utility functions
├── scripts/           # Build and utility scripts
│   └── index-algolia.js  # Algolia indexing script
└── public/            # Static assets
```

## Technology Stack

- **Framework**: [TypeComposer](https://github.com/typecomposer/typecomposer)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + SCSS
- **Search**: [Algolia InstantSearch](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/js/)
- **Content**: MDX (Markdown + JSX)
- **Syntax Highlighting**: [Highlight.js](https://highlightjs.org/)

## Development

### Adding Documentation

1. Create a new `.mdx` file in the appropriate `content/` subdirectory
2. Add the route in `src/router/router.ts`
3. Update sidebar navigation in `src/assets/data.json`
4. Re-index for search: `node scripts/index-algolia.js`

### Customizing Theme

Theme colors are defined in `src/styles/style.scss`:
- Light theme: `[data-theme="light"]`
- Dark theme: `[data-theme="dark"]`

### Search Customization

Search UI can be customized in:
- `/src/components/search/AlgoliaSearch.ts` - Search logic and widgets
- `/src/components/search/SearchModal.ts` - Modal behavior
- `/src/components/search/search.scss` - Search styles

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run clean` - Clean build cache and restart

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Links

- [TypeComposer Framework](https://github.com/typecomposer/typecomposer)
- [Documentation Website](https://www.typecomposer.io)
- [NPM Package](https://www.npmjs.com/package/typecomposer)
- [Algolia Setup Guide](./ALGOLIA_SETUP.md)

## Support

- 📧 Email: support@typecomposer.io
- 💬 Discord: [Join our community](https://discord.gg/typecomposer)
- 🐛 Issues: [GitHub Issues](https://github.com/TypeComposer/docs/issues)
