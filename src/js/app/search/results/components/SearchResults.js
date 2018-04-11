import './SearchResults.pcss';

import React from 'react';
import config from "../../../../config";

import SearchResultContainer from "../SearchResultContainer";
import SearchResultsNotFound from "./SearchResultsNotFound";
import SearchResultsPagination from "./SearchResultsPagination";
import CollapsedSearchResults from "./CollapsedSearchResults";
import {Collapse} from "react-bootstrap";

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

    showBookmarkedResults() { this.setState({showBookmarked: !this.state.showBookmarked}) }

    render() {
        if (this.props.progress.resultsNotFound) {
            return <SearchResultsNotFound/>;
        }

        const prefix = (this.props.matches < config.aboutPrefixAt) ? "" : "About ";
        const timeIndicator = prefix + numberWithCommas(this.props.matches) + " results (" + this.props.elapsedTime + " seconds)";
        const list = [];
        let lastBookmarkedResults = [];
        for (const [index, result] of this.props.results.entries()) {
            const resultProps = {
                searchState: this.props.searchState,
                serpId: this.props.serpId,
                result: result,
                bookmark: 0,
                provider: this.props.provider,
                showBookmarked: this.state.showBookmarked
            };

            if (this.props.distributionOfLabour === 'unbookmarkedSoft') {
                if (result.metadata.bookmark) {
                    lastBookmarkedResults.push(<SearchResultContainer {...resultProps} key={index}/>);
                } else {
                    if (lastBookmarkedResults.length > 0) {
                        list.push(<CollapsedSearchResults resultsLength={lastBookmarkedResults.length} showBookmarked={this.state.showBookmarked} showBookmarkedResultsHandler={this.showBookmarkedResults.bind(this)}/>);
                        lastBookmarkedResults = [];
                    }
                }
            }
            list.push(<SearchResultContainer {...resultProps} key={index}/>);
        }
        if (lastBookmarkedResults.length > 0) {
            list.push(<CollapsedSearchResults resultsLength={lastBookmarkedResults.length} showBookmarked={this.state.showBookmarked} showBookmarkedResultsHandler={this.showBookmarkedResults.bind(this)}/>);
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
                    {config.interface.timeIndicator && this.props.results.length > 0 &&
                        <div className="time"> {timeIndicator}</div>
                    }
                    {this.props.distributionOfLabour === "unbookmarkedSoft" &&
                        <div className="collapsedText">
                            {this.state.showBookmarked ? " " : " " + bookmarkedResultsLength + " bookmarked results hidden "}
                            {bookmarkedResultsLength > 0 &&
                                <a onClick={this.showBookmarkedResults.bind(this)}>
                                    {showBookmarkedText}
                                </a>
                            }
                        </div>
                    }
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