import WebSearchResult from "./app/search/results/components/types/WebSearchResult";
import ImagesSearchResult from "./app/search/results/components/types/ImagesSearchResult";
import VideosSearchResult from "./app/search/results/components/types/VideosSearchResult";
import NewsSearchResult from "./app/search/results/components/types/NewsSearchResult";
import TextSearchResult from "./app/search/results/components/types/TextSearchResult";

const providerVerticals = {
    'bing': new Map([
        ['web', WebSearchResult],
        ['images', ImagesSearchResult],
        ['videos', VideosSearchResult],
        ['news', NewsSearchResult]
    ]),
    'elasticsearch': new Map([
        ['text', TextSearchResult],
    ]),
    'indri': new Map([
        ['AQUAINT', TextSearchResult]
    ])
};

module.exports = {
    aboutPrefixAt: 1000, /* at how many search results do we start saying 'About X results' vs. 'X results' */
    logTimeInterval: 5000,
    defaultProvider: 'indri',
    defaultVariant: 'S3',
    variantQueryParameter: false,
    fallbackToS0ForGroupSize1: false,
    // each provider must have at least one vertical
    providerVerticals: providerVerticals,
    interface: {
        annotations: true,
        ratings: true,
        views: true,
        chat: true,
        timeIndicator: true,
        star: true,
        bookmarkTime: true,
        verticals: true
    }
};
