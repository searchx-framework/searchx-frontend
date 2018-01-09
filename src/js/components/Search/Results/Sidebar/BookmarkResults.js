import './Sidebar.css';

import React from 'react';
import AppActions from '../../../../AppActions';
import BookmarkResult from './BookmarkResult';
import BookmarkStore from '../../../../stores/SessionStore';

export default class BookmarkResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookmarks: BookmarkStore.getBookmarks()
         };

        AppActions.getBookmarks();
        this._onChange = this._onChange.bind(this);
    }

    componentWillMount() {
        BookmarkStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        BookmarkStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        if (this.refs.myRef) {
            this.setState({ bookmarks: BookmarkStore.getBookmarks()});
        }
    }
    
    ////

    render() {
        let bookmarks = this.state.bookmarks.map((result, index) => {
            return (
                <BookmarkResult result={result} index={index} key={index}/>
            );
        });

        return (
            <div className="BookmarkResults" ref="myRef" id="intro-bookmark-bar">
                <h3> <i className="fa fa-star medium"/> BOOKMARKS</h3>
                <div className="list">
                    {bookmarks}
                </div>
            </div>
        )
    }
};