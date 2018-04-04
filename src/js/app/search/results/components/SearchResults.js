import './SearchResults.pcss';

import React from 'react';
import config from "../../../../config";

import SearchResultContainer from "../SearchResultContainer";
import SearchResultsNotFound from "./SearchResultsNotFound";
import SearchResultsPagination from "./SearchResultsPagination";

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default class SearchResultsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showBookmarked: props.distributionOfLabour === 'false'
        }
    }

    render() {
        if (this.props.progress.resultsNotFound) {
            return <SearchResultsNotFound/>;
        }

        const prefix = (this.props.matches < config.aboutPrefixAt) ? "" : "About ";
        const timeIndicator = prefix + numberWithCommas(this.props.matches) + " results (" + this.props.elapsedTime + " seconds)";
        const list = [];
        for (const [index, result] of this.props.results.entries()) {
            const resultProps = {
                searchState: this.props.searchState,
                serpId: this.props.serpId,
                result: result,
                bookmark: 0,
                provider: this.props.provider,
                showBookmarked: this.state.showBookmarked
            };

            list.push(<SearchResultContainer {...resultProps} key={index}/>);
        }

        const bookmarkedResultsLength = this.props.results.filter(result => result.metadata.bookmark).length;
        const showBookmarkedText = this.state.showBookmarked ?
            "Hide bookmarked results" :
            "(click to show)";

        return (
            <div>
                <div className="SearchResults" id="intro-search-results">
                    {this.props.progress.querySubmitted &&
                    <Loader
                        loaded={this.props.results.length > 0 || this.props.progress.isRefreshing() || this.props.progress.isFinished()}/>
                    }
                    {(this.props.results.length > 0) && (this.props.distributionOfLabour === "unbookmarkedSoft") ? (
                        <div className="time"> {timeIndicator} -
                            {this.state.showBookmarked ? " " : " " + bookmarkedResultsLength + " bookmarked results hidden "}
                            <a onClick={() => this.setState({showBookmarked: !this.state.showBookmarked})}>
                                {showBookmarkedText}
                            </a>
                        </div>
                    ) : (this.props.results.length > 0 &&
                        <div className="time"> {timeIndicator}</div>
                    )
                    }
                    <div className="collapsedText">

                    </div>
                    <div className="list">
                        {list}
                    </div>
                </div>

                <SearchResultsPagination
                    searchState={this.props.searchState}
                    finished={this.props.results.length > 0 || this.props.progress.finished}
                    matches={this.props.matches}
                    changeHandler={this.props.pageChangeHandler}
                />
            </div>
        )
    }
};