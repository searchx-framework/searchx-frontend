import './SearchResults.pcss';

import React from 'react';
import config from "../../../../config";

import SearchResultContainer from "../SearchResultContainer";
import SearchResultsNotFound from "./SearchResultsNotFound";
import SearchResultsPagination from "./SearchResultsPagination";
import CollapsedResultsButton from "./CollapsedSearchResults";
import {Button, Collapse} from "react-bootstrap";
import {LoggerEventTypes} from "../../../../utils/LoggerEventTypes";
import {log} from "../../../../utils/Logger";
import $ from 'jquery';

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getId(result) {
    return result.id ? result.id : result.url;
}

function getResultIds(results) {
    return results.map(result => getId(result));
}

export default class SearchResultsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: {},
            autoHide: false,
        };

        this.showAllCollapsedResults = this.showAllCollapsedResults.bind(this);
        this.hideAllCollapsedResults = this.hideAllCollapsedResults.bind(this);
        this.showCollapsedResults = this.showCollapsedResults.bind(this);
        this.hideCollapsedResults = this.hideCollapsedResults.bind(this);
        this.isCollapsible = this.isCollapsible.bind(this);
    }



    componentWillReceiveProps(nextProps) {
        const resultIdMap = {};
        this.props.results.forEach(result => resultIdMap[getId(result)] = true);
        const newResults = nextProps.results.filter(result => !(resultIdMap[getId(result)]));
        const newCollapsibleResults = newResults.filter(this.isCollapsible);
        const newCollapsibleResultIds = newCollapsibleResults.map(result => result.id);
        if (newCollapsibleResultIds) {
            this.hideCollapsedResults(newCollapsibleResultIds);
        }

        if (nextProps.searchState.page !== this.props.searchState.page || nextProps.searchState.query !== this.props.searchState.query) {
            this.showAllCollapsedResults();
            this.hideAllCollapsedResults();
        }
    }

    getMetaInfo() {
        return {
            bookmarkedIds: this.props.results.filter(result => result.metadata.bookmark).map(result => getId(result)),
            excludedIds: this.props.results.filter(result => result.metadata.exclude).map(result => getId(result)),
            query: this.props.searchState.query,
            page: this.props.searchState.page,
            serpId: this.props.serpId,
        }
    }

    isCollapsible(result) {
        return this.props.distributionOfLabour
            && !this.props.tutorial
            && (result.metadata.bookmark || result.metadata.exclude);
    }

    showAllCollapsedResults() {
        log(LoggerEventTypes.SEARCH_SHOW_ALL_COLLAPSED, this.getMetaInfo());
        this.setState({
            collapsed: {}
        });
    }

    hideAllCollapsedResults() {
        log(LoggerEventTypes.SEARCH_HIDE_ALL_COLLAPSED, this.getMetaInfo());
        const collapsed = {};
        this.props.results.forEach((result) => {
            if (this.isCollapsible(result)) {
                collapsed[getId(result)] = true;
            }
        });
        this.setState({
            collapsed: collapsed,
        });
    }

    getCollapsibleResultsLength() {
        return this.props.results.filter(result => this.isCollapsible(result)).length;
    }

    showCollapsedResults(ids) {
        const collapsed = this.state.collapsed;

        ids.forEach((id) => {
            collapsed[id] = false;
        });

        this.setState({
            collapsed: collapsed
        });
    }

    hideCollapsedResults(ids) {
        const collapsed = this.state.collapsed;

        ids.forEach((id) => {
            collapsed[id] = true;
        });

        this.setState({
            collapsed: collapsed
        });
    }

    resultsAreCollapsed(results) {
        let output = false;
        results.forEach((result) => {
            if (this.state.collapsed[getId(result)]) {
                output = true;
            }
        });
        return output;
    }



    render() {


        // Trick to remove last page from pagination;
        $(".pagination").find("a").last().hide();
        const pagination = <SearchResultsPagination
            searchState={this.props.searchState}
            finished={this.props.results.length > 0 || this.props.progress.finished}
            matches={this.props.matches}
            changeHandler={this.props.pageChangeHandler}
        />;
        
        if (this.props.progress.resultsNotFound) {
            return <div>
                <SearchResultsNotFound/>
                {this.props.searchState.page > 1 && pagination}
            </div>;
        }

        const prefix = (this.props.matches < config.aboutPrefixAt) ? "" : "About ";
        const timeIndicator = prefix + numberWithCommas(this.props.matches) + " results (" + this.props.elapsedTime + " seconds)";
        let visitedUrls = JSON.parse(localStorage.getItem('visited-urls'));
        if (!visitedUrls) {
            visitedUrls = {}
        }
        let list = [];
        let lastCollapsedResults = [];
        let lastCollapsedResultsComponents = [];
        for (const [index, result] of this.props.results.entries()) {
            const collapsed = this.props.distributionOfLabour && this.state.collapsed[getId(result)];

            const resultProps = {
                searchState: this.props.searchState,
                serpId: this.props.serpId,
                result: result,
                bookmark: 0,
                provider: this.props.provider,
                collapsed: collapsed,
                hideCollapsedResultsHandler: this.hideCollapsedResults,
                autoHide: this.state.autoHide,
                isCollapsible: this.isCollapsible(result),
                visited: visitedUrls[getId(result)] === true
            };

            if (this.props.distributionOfLabour === 'unbookmarkedSoft') {
                if (this.state.collapsed[getId(result)]) {
                    lastCollapsedResults.push(result);
                    lastCollapsedResultsComponents.push(<SearchResultContainer {...resultProps} key={getId(result)} index={index}/>);
                } else {
                    if (lastCollapsedResults.length > 0) {
                        list.push(<CollapsedResultsButton results={lastCollapsedResults} resultsAreCollapsed={this.resultsAreCollapsed(lastCollapsedResults)} showCollapsedResultsHandler={this.showCollapsedResults} hideCollapsedResultsHandler={this.hideCollapsedResults} searchState={this.props.searchState} serpId={this.props.serpId} index={index}/>);
                        list = list.concat(lastCollapsedResultsComponents);
                        list.push(<SearchResultContainer {...resultProps} key={getId(result)} index={index}/>);
                        lastCollapsedResults = [];
                        lastCollapsedResultsComponents =[];
                    } else {
                        list.push(<SearchResultContainer {...resultProps} key={getId(result)} index={index}/>);
                    }
                }
            } else {
                list.push(<SearchResultContainer {...resultProps} key={getId(result)} index={index}/>);
            }


        }
        if (lastCollapsedResults.length > 0) {
            list = list.concat(lastCollapsedResultsComponents);
            list.push(<CollapsedResultsButton key={getResultIds(lastCollapsedResults)} results={lastCollapsedResults} resultsAreCollapsed={this.resultsAreCollapsed(lastCollapsedResults)} showCollapsedResultsHandler={this.showCollapsedResults} hideCollapsedResultsHandler={this.hideCollapsedResults} searchState={this.props.searchState} serpId={this.props.serpId}/>);
        }
        const currentCollapsedResultsLength = Object.values(this.state.collapsed).filter(value => value).length;
        const allBookmarkedResultsShown = currentCollapsedResultsLength === 0;
        const allBookmarkedResultsHidden = currentCollapsedResultsLength === this.getCollapsibleResultsLength();


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
                            <Button className="allCollapsedResultsButton" onClick={this.showAllCollapsedResults} disabled={allBookmarkedResultsShown}>
                                Show all hidden results
                            </Button>
                            <Button className="allCollapsedResultsButton" onClick={this.hideAllCollapsedResults} disabled={allBookmarkedResultsHidden}>
                                Hide all saved and excluded results
                            </Button>
                        </div>
                    }
                    <div className="list">
                        {list}
                    </div>
                </div>

                {pagination}
            </div>
        )
    }
};