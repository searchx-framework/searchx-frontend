import './Bookmark.pcss';
import React from 'react';
import BookmarkItem from './BookmarkItem';
import BookmarkWindow from "./BookmarkWindow";

const Bookmarks = function({bookmarks, popup, removeHandler, starHandler, clickHandler, popupHandler}) {
    const list = bookmarks.map((data, index) => {
        return <BookmarkItem
            key={index}
            data={data}
            removeHandler={removeHandler}
            starHandler={starHandler}
            clickHandler={clickHandler}
        />
    });

    return (
        <div className="Bookmarks">
            <h3 className="banner" onClick={popupHandler}>
                <i className="fa fa-bookmark medium"/> Saved documents
            </h3>

            <div className="list">
                {list}
            </div>

            <BookmarkWindow
                active={popup}
                list={list}
                closeHandler={popupHandler}
            />
        </div>
    )
};

export default Bookmarks;