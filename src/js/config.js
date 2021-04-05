import WebSearchResult from "./app/search/results/components/types/WebSearchResult";
import ImagesSearchResult from "./app/search/results/components/types/ImagesSearchResult";
import VideosSearchResult from "./app/search/results/components/types/VideosSearchResult";
import NewsSearchResult from "./app/search/results/components/types/NewsSearchResult";
import TextSearchResult from "./app/search/results/components/types/TextSearchResult";
import ShoppingSearchResult from "./app/search/results/components/types/ShoppingSearchResult";

import ShoppingFilters from "./app/search/results/components/filters/types/ShoppingFilters";
import ProductViewer from "./app/search/results/components/viewer/ProductViewer";
import TextViewer from "./app/search/results/components/viewer/TextViewer";

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
    'elasticsearch': new Map(["All", "Electronics",  "Home and Kitchen", "Beauty", "Office Products", "Sports and Outdoors", "Toys and Games"
    ].map((v) => [v, ShoppingSearchResult])),
    'indri': new Map([
        ['AQUAINT', TextSearchResult]
    ])
};

const providerFilters = {
    'elasticsearch': ShoppingFilters
};



const providerViewers = {
    'elasticsearch': ProductViewer,
    'indri' :TextViewer
};




var config = {
    dataset: "ECOMM",
    aboutPrefixAt: 1000, /* at how many search results do we start saying 'About X results' vs. 'X results' */
    logTimeInterval: 5000,
    defaultProvider: 'elasticsearch',
    defaultVariant: 'S0',
    bookmarkIcon: "fa-heart",
    variantQueryParameter: false, /* allow the variant to be modified by a query parameter, or fix it to the default or variant set by the task */
    fallbackToS0ForGroupSize1: false, /* always make group sizes of size 1 use variant S0 */
    providerVerticals: providerVerticals,
    providerFilters: providerFilters,
    providerViewers: providerViewers,
    interface: { /* toggle various interface features on or off */
        annotations: false, /* allow users to place annotations (`co`mments) on documents */
        ratings: false, /* allow users to rate search results and show the ratings for the group */
        views: false, /* show the number of times a result has been viewed */
        chat: true, /* enable the group chat feature */
        timeIndicator: false, /* show the time it took to return results */
        star: true, /* allow users to star bookmarks */
        saveTimestamp: true, /* show the time and date at which a document was saved */
        verticals: true, /* show the vertical selection menu */
        filters : true, /* show filters on search results */
        navigation: 'shared', /* set type of navigation */
        groupMembersAnonymous: false, /* show group bar with anonymous userId */
        suggestions: false  /* show query suggestions */
    }
};

export default config;