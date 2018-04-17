import './SearchResults.pcss';

import React from 'react';
import config from "../../../../config";

import SearchResultContainer from "../SearchResultContainer";
import SearchResultsNotFound from "./SearchResultsNotFound";
import SearchResultsPagination from "./SearchResultsPagination";
import CollapsedSearchResults from "./CollapsedSearchResults";
import {Button, Collapse} from "react-bootstrap";
import {LoggerEventTypes} from "../../../../utils/LoggerEventTypes";
import {log} from "../../../../utils/Logger";

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default class SearchResultsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: {},
            numberOfCollapsibleResults: 0
        };

        this.showAllCollapsedResults = this.showAllCollapsedResults.bind(this);
        this.hideAllCollapsedResults = this.hideAllCollapsedResults.bind(this);
        this.showCollapsedResult = this.showCollapsedResult.bind(this);
        this.hideCollapsedResult = this.hideCollapsedResult.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.results) {
            this._hideAllCollapsedResults();
        }
    }

    isCollapsible(result) {
        return (result.metadata.bookmark || result.metadata.exclude);
    }

    getMetaInfo() {
        return {
            bookmarkedIds: this.props.results.filter(result => result.metadata.bookmark).map(result => result.id),
            excludedIds: this.props.results.filter(result => result.metadata.exclude).map(result => result.id),
            query: this.props.searchState.query,
            page: this.props.searchState.page,
            serpId: this.props.serpId,
        }
    }

    showAllCollapsedResults() {
        log(LoggerEventTypes.SEARCH_SHOW_ALL_COLLAPSED, this.getMetaInfo());
        this.setState({
            collapsed: {}
        });
    }

    hideAllCollapsedResults() {
        log(LoggerEventTypes.SEARCH_HIDE_ALL_COLLAPSED, this.getMetaInfo());
        this._hideAllCollapsedResults();
    }

    _hideAllCollapsedResults() {
        const collapsed = {};
        let previousIsCollapsible = false;
        for (const [index, result] of this.props.results.entries()) {
            if (this.isCollapsible(result)) {
                previousIsCollapsible = true;
            } else if (previousIsCollapsible) {
                collapsed[index] = true;
                previousIsCollapsible = false;
            }
        }
        if (previousIsCollapsible) {
            collapsed[this.props.results.length] = true;
        }
        this.setState({
            collapsed: collapsed,
            numberOfCollapsibleResults: Object.keys(collapsed).length
        });
    }

    showCollapsedResult(index) {
        const collapsed = this.state.collapsed;

        collapsed[index] = false;

        this.setState({
            collapsed: collapsed
        });
    }

    hideCollapsedResult(index) {
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
        let lastCollapsibleResults = [];
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
                if (this.isCollapsible(result)) {
                    resultProps.showBookmarked = true;
                    lastCollapsibleResults.push(<SearchResultContainer {...resultProps} key={index}/>);
                } else {
                    if (lastCollapsibleResults.length > 0) {
                        list.push(<CollapsedSearchResults index={index} results={lastCollapsibleResults} collapsed={this.state.collapsed[index]} showCollapsedResultHandler={this.showCollapsedResult} hideCollapsedResultHandler={this.hideCollapsedResult} searchState={this.props.searchState} serpId={this.props.serpId}/>);
                        lastCollapsibleResults = [];
                    }
                    list.push(<SearchResultContainer {...resultProps} key={index}/>);
                }
            } else {
                list.push(<SearchResultContainer {...resultProps} key={index}/>);
            }

        }
        if (lastCollapsibleResults.length > 0) {
            list.push(<CollapsedSearchResults index={this.props.results.length} results={lastCollapsibleResults} collapsed={this.state.collapsed[this.props.results.length]} showCollapsedResultHandler={this.showCollapsedResult} hideCollapsedResultHandler={this.hideCollapsedResult} searchState={this.props.searchState} serpId={this.props.serpId}/>);
        }
        const currentCollapsedResultsLength = Object.values(this.state.collapsed).filter(value => value).length;
        const allBookmarkedResultsShown = currentCollapsedResultsLength === 0;
        const allBookmarkedResultsHidden = currentCollapsedResultsLength === this.state.numberOfCollapsibleResults;

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
                            {this.state.numberOfCollapsibleResults > 0 &&
                                [
                                    <Button className="allCollapsedResultsButton" onClick={this.showAllCollapsedResults} disabled={allBookmarkedResultsShown}>
                                        Show all hidden results
                                    </Button>,
                                    <Button className="allCollapsedResultsButton" onClick={this.hideAllCollapsedResults} disabled={allBookmarkedResultsHidden}>
                                        Hide all bookmarked and excluded results
                                    </Button>
                                ]
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