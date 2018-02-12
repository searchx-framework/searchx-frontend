import React from 'react';
import Rating from 'react-rating';

import WebSearchResult from './types/WebSearchResult';
import NewsSearchResult from './types/NewsSearchResult';
import ImagesSearchResult from './types/ImagesSearchResult';
import VideosSearchResult from './types/VideosSearchResult';

const SearchResult = function({searchState, serpId, result, bookmarkClickHandler, urlClickHandler}) {
    const bookmark = result.bookmark;
    const bookmarkTime = result.bookmarkTime;
    const bookmarkUserColor = result.bookmarkUserColor;

    let bookmarkButton = <Rating
        className="rating"
        empty="fa fa-bookmark-o"
        full="fa fa-bookmark"
        onClick={bookmarkClickHandler}
        stop={1}
        initialRate={bookmark ? 1 : 0}
    />;

    let bookmarkInfo = <span/>;
    if (bookmark) {
        const date = new Date(bookmarkTime);
        const now = new Date().toLocaleDateString();

        let formattedTime = date.toLocaleDateString();
        if (formattedTime === now) {
            formattedTime = date.toLocaleTimeString()
        }

        bookmarkInfo =
            <span style={{color: bookmarkUserColor, marginBottom: 10, marginTop: -5}}>
                <i className="fa fa-clock-o"/>
                {" Bookmarked at " + formattedTime}
            </span>;
    }

    ////

    const props = {
        searchState: searchState,
        serpId: serpId,
        result: result,
        bookmarkButton: bookmarkButton,
        bookmarkInfo: bookmarkInfo,
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
