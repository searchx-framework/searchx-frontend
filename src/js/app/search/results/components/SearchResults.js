import './SearchResults.pcss';

import React from 'react';
import config from "../../../../config";

import SearchResultContainer from "../SearchResultContainer";
import SearchResultsNotFound from "./SearchResultsNotFound";
import SearchResultsPagination from "./SearchResultsPagination";
import CollapsedSearchResults from "./CollapsedSearchResults";
import {Button, Collapse} from "react-bootstrap";

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default class SearchResultsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: {},
        };

        this.showBookmarkedResultsHandler = this.showBookmarkedResultsHandler.bind(this);
        this.showCollapsedResultHandler = this.showCollapsedResultHandler.bind(this);
        this.hideCollapsedResultHandler = this.hideCollapsedResultHandler.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.results) {
            this.hideAllCollapsedResults();
        }
    }

    showBookmarkedResultsHandler() {
        const allBookmarkedResultsShown = Object.values(this.state.collapsed).filter(value => value).length === 0;
        if (allBookmarkedResultsShown) {
            this.hideAllCollapsedResults();
        } else {
            this.showAllCollapsedResults();
        }
    }

    showAllCollapsedResults() {
        this.setState({
            collapsed: {}
        });
    }

    hideAllCollapsedResults() {
        const collapsed = {};
        let previousIsBookmark = false;
        for (const [index, result] of this.props.results.entries()) {
            if (result.metadata.bookmark) {
                previousIsBookmark = true;
            } else if (previousIsBookmark) {
                collapsed[index] = true;
                previousIsBookmark = false;
            }
        }
        if (previousIsBookmark) {
            collapsed[this.props.results.length] = true;
        }
        this.numberOfCollapsedResults = Object.keys(collapsed).length;
        this.setState({
            collapsed: collapsed
        });
    }

    showCollapsedResultHandler(index) {
        const collapsed = this.state.collapsed;

        collapsed[index] = false;

        this.setState({
            collapsed: collapsed
        });
    }

    hideCollapsedResultHandler(index) {
        const collapsed = this.state.collapsed;

        collapsed[index] = true;

        this.setState({
            collapsed: collapsed
        });
    }

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
                    resultProps.showBookmarked = true;
                    lastBookmarkedResults.push(<SearchResultContainer {...resultProps} key={index}/>);
                } else {
                    if (lastBookmarkedResults.length > 0) {
                        list.push(<CollapsedSearchResults index={index} results={lastBookmarkedResults} collapsed={this.state.collapsed[index]} showCollapsedResultHandler={this.showCollapsedResultHandler} hideCollapsedResultHandler={this.hideCollapsedResultHandler} searchState={this.props.searchState} serpId={this.props.serpId}/>);
                        lastBookmarkedResults = [];
                    }
                    list.push(<SearchResultContainer {...resultProps} key={index}/>);
                }
            } else {
                list.push(<SearchResultContainer {...resultProps} key={index}/>);
            }

        }
        if (lastBookmarkedResults.length > 0) {
            list.push(<CollapsedSearchResults index={this.props.results.length}  results={lastBookmarkedResults} collapsed={this.state.collapsed[this.props.results.length]} showCollapsedResultHandler={this.showCollapsedResultHandler} hideCollapsedResultHandler={this.hideCollapsedResultHandler} searchState={this.props.searchState} serpId={this.props.serpId}/>);
        }
        const allBookmarkedResultsShown = Object.values(this.state.collapsed).filter(value => value).length === 0;
        const showBookmarkedText = allBookmarkedResultsShown ?
            "Hide all bookmarked and excluded results" :
            "Show all hidden results";

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
                            {this.props.hiddenResults  > 0 &&
                                <Button onClick={this.showBookmarkedResultsHandler}>
                                    {showBookmarkedText}
                                </Button>
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