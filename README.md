# Pienapple installation instructions

Set Pienapple backend API:
In webpack.config.js set in externals the host of the production or development:
```
    externals: {
        'config': JSON.stringify(process.env.ENV === 'production' ? {
        serverUrl: "https://myserver.com"
        } : {
        serverUrl: "http://localhost:3001"
  })
```

Install all dependencies:

```
npm i babel webpack webpack-dev-server
npm update
```
Make sure the versions are:
- babel: 6.23.0
- webpack 2.6.1
- webpack-dev-server: 2.4.5

Start the development server:

```
npm start
```

# Notes

## Tutorial

The tutorial texts are hardcoded right now, something that needs to be fixed in subsequent version. The texts are in
- `src/js/components/Header/Search.js` (explains the search box)
- `src/js/components/SearchVerticals.js` (explains the verticals)
- `src/js/components/SearchResults/WebSearchResults.js` (explains the rating system)
