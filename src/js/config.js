import WebSearchResult from "./app/search/results/components/types/WebSearchResult";
import ImagesSearchResult from "./app/search/results/components/types/ImagesSearchResult";
import VideosSearchResult from "./app/search/results/components/types/VideosSearchResult";
import NewsSearchResult from "./app/search/results/components/types/NewsSearchResult";
import TextSearchResult from "./app/search/results/components/types/TextSearchResult";

// The keys in this mapping determines the order and names of the verticals shown to the user.
// The values are the types of the result components that are used for each vertical.
// Each provider must have at least one vertical.
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
    defaultProvider: 'bing',
    defaultVariant: 'S0',
    variantQueryParameter: false, /* allow the variant to be modified by a query parameter, or fix it to the default or variant set by the task */
    fallbackToS0ForGroupSize1: false, /* always make group sizes of size 1 use variant S0 */
    providerVerticals: providerVerticals,
    interface: { /* toggle various interface features on or off */
        annotations: true, /* allow users to place annotations (comments) on documents */
        ratings: true, /* allow users to rate search results and show the ratings for the group */
        views: true, /* show the number of times a result has been viewed */
        chat: true, /* enable the group chat feature */
        timeIndicator: true, /* show the time it took to return results */
        star: true, /* allow users to star bookmarks */
        saveTimestamp: true, /* show the time and date at which a document was saved */
        verticals: true /* show the vertical selection menu */
    }
};
