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

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getId(result) {
    return result.id ? result.id : result.url;
}

function isCollapsible(result) {
    return (result.metadata.bookmark || result.metadata.exclude);
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
            resultIdMap: {}
        };

        this.showAllCollapsedResults = this.showAllCollapsedResults.bind(this);
        this.hideAllCollapsedResults = this.hideAllCollapsedResults.bind(this);
        this.showCollapsedResults = this.showCollapsedResults.bind(this);
        this.hideCollapsedResults = this.hideCollapsedResults.bind(this);
    }


    componentWillReceiveProps(nextProps) {
        const newResults = nextProps.results.filter(result => !(result.id in this.state.resultIdMap));
        const resultIdMap = this.state.resultIdMap;
        newResults.forEach(result => {
            resultIdMap[result.id] = true;
        });
        this.setState({resultIdMap: resultIdMap});
        const newCollapsibleResults = newResults.filter(isCollapsible);
        const newCollapsibleResultIds = newCollapsibleResults.map(result => result.id);
        if (newCollapsibleResultIds) {
            this.hideCollapsedResults(newCollapsibleResultIds);
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
            if (isCollapsible(result)) {
                collapsed[getId(result)] = true;
            }
        });
        this.setState({
            collapsed: collapsed,
        });
    }

    getCollapsibleResultsLength() {
        return this.props.results.filter(result => isCollapsible(result)).length;
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
        if (this.props.progress.resultsNotFound) {
            return <SearchResultsNotFound/>;
        }

        const prefix = (this.props.matches < config.aboutPrefixAt) ? "" : "About ";
        const timeIndicator = prefix + numberWithCommas(this.props.matches) + " results (" + this.props.elapsedTime + " seconds)";
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
            };

            if (this.props.distributionOfLabour === 'unbookmarkedSoft') {
                if (this.state.collapsed[getId(result)]) {
                    lastCollapsedResults.push(result);
                    lastCollapsedResultsComponents.push(<SearchResultContainer {...resultProps} key={getId(result)}/>);
                } else {
                    if (lastCollapsedResults.length > 0) {
                        list.push(<CollapsedResultsButton results={lastCollapsedResults} resultsAreCollapsed={this.resultsAreCollapsed(lastCollapsedResults)} showCollapsedResultsHandler={this.showCollapsedResults} hideCollapsedResultsHandler={this.hideCollapsedResults} searchState={this.props.searchState} serpId={this.props.serpId}/>);
                        list = list.concat(lastCollapsedResultsComponents);
                        list.push(<SearchResultContainer {...resultProps} key={getId(result)}/>);
                        lastCollapsedResults = [];
                        lastCollapsedResultsComponents =[];
                    } else {
                        list.push(<SearchResultContainer {...resultProps} key={getId(result)}/>);
                    }
                }
            } else {
                list.push(<SearchResultContainer {...resultProps} key={getId(result)}/>);
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
                                Hide all bookmarked and excluded results
                            </Button>
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