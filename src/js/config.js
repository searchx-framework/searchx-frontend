import WebSearchResult from "./app/search/results/components/types/WebSearchResult";
import ImagesSearchResult from "./app/search/results/components/types/ImagesSearchResult";
import VideosSearchResult from "./app/search/results/components/types/VideosSearchResult";
import NewsSearchResult from "./app/search/results/components/types/NewsSearchResult";

const providerVerticals = new Map([
    ['bing', new Map([
        ['web', WebSearchResult],
        ['images', ImagesSearchResult],
        ['videos', VideosSearchResult],
        ['news', NewsSearchResult]
    ])],
    ['elasticsearch', new Map([
        ['web', WebSearchResult],
    ])],
    ['indri', new Map([
        ['web', WebSearchResult]
    ])]
]);

module.exports = {
    aboutPrefixAt: 1000, /* at how many search results do we start saying 'About X results' vs. 'X results' */
    logTimeInterval: 5000,
    defaultProvider: 'bing',
    // each provider must have at least one vertical
    providerVerticals: providerVerticals
};
