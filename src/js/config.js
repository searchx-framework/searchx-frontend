module.exports = {
    aboutPrefixAt: 1000, /* at how many search results do we start saying 'About X results' vs. 'X results' */
    logTimeInterval: 5000,
    defaultProvider: 'bing',
    // each provider must have at least one vertical
    providerVerticals: {
        'bing': ['web', 'images', 'videos', 'news'],
        'elasticsearch': ['web']
    }
};
