import React from 'react';
import Rating from 'react-rating';

import WebSearchResult from './types/WebSearchResult';
import NewsSearchResult from './types/NewsSearchResult';
import ImagesSearchResult from './types/ImagesSearchResult';
import VideosSearchResult from './types/VideosSearchResult';

function formatMetadata(metadata) {
    let elements = [];
    elements.push(<span><i className="fa fa-eye"/> {metadata.views}</span>);
    elements.push(<span><i className="fa fa-thumbs-o-up"/> {metadata.rating}</span>);
    elements.push(<span><i className="fa fa-comments"/> {metadata.annotations}</span>);

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

const SearchResult = function({searchState, serpId, result, bookmarkClickHandler, urlClickHandler}) {
    const metadataInfo = formatMetadata(result.metadata);
    const bookmarkButton = <Rating
        className="rating" empty="fa fa-bookmark-o" full="fa fa-bookmark"
        onClick={bookmarkClickHandler}
        stop={1} initialRate={result.metadata.bookmark !== null ? 1 : 0}
    />;

    const props = {
        searchState: searchState,
        serpId: serpId,
        result: result,
        metadata: metadataInfo,
        bookmarkButton: bookmarkButton,
        urlClickHandler: urlClickHandler
    };

    return (
        <div className="SearchResult">
            {searchState.vertical === 'web' && <WebSearchResult {...props}/>}
            {searchState.vertical === 'news' && <NewsSearchResult {...props}/>}
            {searchState.vertical === 'images' && <ImagesSearchResult {...props}/>}
            {searchState.vertical === 'videos' && <VideosSearchResult {...props}/>}
        </div>
    );
};

export default SearchResult;
