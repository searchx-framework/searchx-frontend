import './SearchResults.pcss';

import React from 'react';
import config from "../../../../config";

import SearchResultContainer from "../SearchResultContainer";
import SearchResultsNotFound from "./SearchResultsNotFound";
import SearchResultsPagination from "./SearchResultsPagination";
import CollapsedSearchResults from "./CollapsedSearchResults";

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const SearchResults = function({searchState, progress, serpId, results, matches, elapsedTime, pageChangeHandler, provider, distributionOfLabour}) {
    if (progress.resultsNotFound) {
        return <SearchResultsNotFound/>;
    }

    const prefix = (matches < config.aboutPrefixAt) ? "" : "About ";
    const timeIndicator = prefix + numberWithCommas(matches) + " results (" + elapsedTime + " seconds)";
    const list = [];
    let lastBookmarkedResults = [];
    for (const [index, result] of results.entries()) {
        const props = {
            searchState: searchState,
            serpId: serpId,
            result: result,
            bookmark: 0,
            provider: provider
        };

        if (distributionOfLabour === 'unbookmarkedSoft') {
            if (result.metadata.bookmark) {
                lastBookmarkedResults.push(<SearchResultContainer {...props} key={index}/>);
            } else {
                if (lastBookmarkedResults.length > 0) {
                    list.push(<CollapsedSearchResults results={lastBookmarkedResults} />);
                    lastBookmarkedResults = [];
                }
                list.push(<SearchResultContainer {...props} key={index}/>);
            }
        } else {
            list.push(<SearchResultContainer {...props} key={index}/>);
        }
    }
    if (lastBookmarkedResults.length > 0) {
        list.push(<CollapsedSearchResults results={lastBookmarkedResults} />);
    }

    return (
        <div>
            <div className="SearchResults" id="intro-search-results">
                {progress.querySubmitted &&
                    <Loader loaded={results.length > 0 || progress.isRefreshing() || progress.isFinished()}/>
                }

                {results.length > 0 &&
                    <div className="time"> {timeIndicator} </div>
                }

                <div className="list">
                    {list}
                </div>
            </div>

            <SearchResultsPagination
                searchState={searchState}
                finished={results.length > 0 || progress.finished}
                matches={matches}
                changeHandler={pageChangeHandler}
            />
        </div>
    )
};

export default SearchResults;