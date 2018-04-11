import React from 'react';
import Rating from 'react-rating';

import {Collapse} from "react-bootstrap";

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

    if (metadata.bookmark !== null) {
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

const SearchResult = function({searchState, serpId, result, bookmarkClickHandler, urlClickHandler, provider, showBookmarked}) {
    let initial = 0;
    if ('metadata' in result) {
        initial = result.metadata.bookmark !== null ? 1 : 0;
    }

    const bookmarkButton = <Rating
        className="rating" empty="fa fa-bookmark-o" full="fa fa-bookmark"
        onClick={bookmarkClickHandler}
        stop={1} initialRate={initial}
    />;

    const props = {
        searchState: searchState,
        serpId: serpId,
        result: result,
        metadata: formatMetadata(result.metadata),
        bookmarkButton: bookmarkButton,
        urlClickHandler: urlClickHandler
    };
    const ResultType = config.providerVerticals.get(provider).get(searchState.vertical);
    const view = <ResultType {...props}/>;

    return (
        <Collapse in={!result.metadata.bookmark || showBookmarked}>
            <div className="SearchResult" >
                {view}
            </div>
        </Collapse>
    );
};

export default SearchResult;
