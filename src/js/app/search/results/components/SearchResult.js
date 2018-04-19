import React from 'react';
import Rating from 'react-rating';

import {Button, Collapse} from "react-bootstrap";

import config from "../../../../config";

function formatMetadata(metadata) {
    let elements = [];
    if (!metadata) {
        return <div/>;
    }

    if (config.interface.views && 'views' in metadata) {
        elements.push(<span><i className="fa fa-eye"/> {metadata.views}</span>);
    }

    if (config.interface.ratings && 'rating' in metadata) {
        elements.push(<span><i className="fa fa-thumbs-o-up"/> {metadata.rating}</span>);
    }

    if (config.interface.annotations && 'annotations' in metadata) {
        elements.push(<span><i className="fa fa-comments"/> {metadata.annotations}</span>);
    }

    if (metadata.bookmark) {
        const date = new Date(metadata.bookmark.date);
        const now = new Date().toLocaleDateString();

        let formattedTime = date.toLocaleDateString();
        if (formattedTime === now) formattedTime = date.toLocaleTimeString();

        elements.push(
            <span style={{color: metadata.bookmark.userColor}}>
                <i className="fa fa-bookmark"/> {formattedTime}
            </span>
        );
    }

    return <div className="metadata">{elements}</div>;
}

const SearchResult = function({searchState, serpId, result, bookmarkClickHandler, urlClickHandler, provider, collapsed, excludeClickHandler, hideCollapsedResultsHandler}) {
    let initialBookmark = 0;
    let initialExclude = 0;
    if ('metadata' in result) {
        initialBookmark = result.metadata.bookmark ? 1 : 0;
        initialExclude = result.metadata.exclude ? 1 : 0;
    }

    const bookmarkButton = <Rating
        className="rating" empty="fa fa-bookmark-o" full="fa fa-bookmark"
        onClick={bookmarkClickHandler}
        stop={1} initialRate={initialBookmark}
        title="Bookmark"
    />;

    const excludeButton = <Rating
        className="rating" empty="fa fa-ban" full="fa fa-ban red"
        onClick={excludeClickHandler}
        stop={1} initialRate={initialExclude}
        title="Exclude"
    />;


    const props = {
        searchState: searchState,
        serpId: serpId,
        result: result,
        metadata: formatMetadata(result.metadata),
        bookmarkButton: bookmarkButton,
        excludeButton: excludeButton,
        urlClickHandler: urlClickHandler,
        hideCollapsedResultsHandler: hideCollapsedResultsHandler,
    };
    const ResultType = config.providerVerticals[provider].get(searchState.vertical);
    const view = <ResultType {...props}/>;

    return (
        <Collapse in={!collapsed}>
            <div>
                <div className="SearchResult">
                    {view}
                </div>
            </div>
        </Collapse>
    );
};

export default SearchResult;
