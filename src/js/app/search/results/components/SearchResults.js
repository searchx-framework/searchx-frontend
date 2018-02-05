import './SearchResults.pcss';

import React from 'react';
import config from "../../../../config";

import SearchResultContainer from "../SearchResultContainer";
import SearchResultsNotFound from "./SearchResultsNotFound";
import SearchResultsPagination from "./SearchResultsPagination";

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const SearchResults = function({searchState, progress, serpId, results, matches, elapsedTime, pageChangeHandler}) {
    if (progress.resultsNotFound) {
        return <SearchResultsNotFound/>;
    }

    const prefix = (matches < config.aboutPrefixAt) ? "" : "About ";
    const timeIndicator = prefix + numberWithCommas(matches) + " results (" + elapsedTime + " seconds)";
    const list = results.map((result, index) => {
        const props = {
            searchState: searchState,
            serpId: serpId,
            result: result,
            bookmark: 0
        };

        return(<SearchResultContainer {...props} key={index}/>);
    });

    return (
        <div>
            <div className="SearchResults" id="intro-search-results">
                {progress.querySubmitted &&
                    <Loader loaded={results.length > 0 || progress.isRefreshing() || progress.isFinished()}/>
                }

                {results.length > 0 &&
                    <div className="SearchResults-time"> {timeIndicator} </div>
                }

                <div className={"SearchResults-list"}>
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