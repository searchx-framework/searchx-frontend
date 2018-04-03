import './SearchResults.pcss';

import React from 'react';
import config from "../../../../config";

import SearchResultContainer from "../SearchResultContainer";
import SearchResultsPagination from "./SearchResultsPagination";
import CenteredMessage from "../../../common/CenteredMessage";

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const SearchResults = function({searchState, progress, serpId, results, matches, elapsedTime, pageChangeHandler}) {
    const style = {
        color: "darkgray"
    };

    if (progress.resultsNotFound) {
        return <CenteredMessage height="800px" style={style}>
            <h3> Sorry! :`(  </h3>
            <h4> We have not found results for you! Try to shorten your query! </h4>
        </CenteredMessage>
    }

    if (results.length === 0) {
        return <CenteredMessage height="800px" style={style}>
            <h3> Your search results will appear here :)  </h3>
        </CenteredMessage>
    }

    ////

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
            <div className="SearchResults">
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