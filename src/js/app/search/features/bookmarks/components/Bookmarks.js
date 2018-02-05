import './Bookmarks.pcss';
import React from 'react';
import BookmarksItem from './BookmarksItem';

const Bookmarks = function({bookmarks, removeHandler, starHandler}) {
    const list = bookmarks.map((data, index) => {
        return <BookmarksItem
            key={index}
            data={data}
            removeHandler={removeHandler}
            starHandler={starHandler}
        />
    });

    return (
        <div className="Bookmarks" id="intro-bookmarks-bar">
            <h3> <i className="fa fa-bookmark medium"/> BOOKMARKS</h3>
            <div className="list">
                {list}
            </div>
        </div>
    )
};

export default Bookmarks;