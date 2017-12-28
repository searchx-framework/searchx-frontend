import './BookmarkResults.css';

import React from 'react';
import BookmarkResult from './BookmarkResult';
import BookmarkActions from './../BookmarkActions';
import BookmarkStore from '../../../stores/BookmarkStore';

export default class BookmarkResults extends React.Component {
    


    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {
            bookmarks: BookmarkStore.getBookmarks()
         };
        BookmarkActions.getBookmarks();
        
    }

    componentWillMount() {
        BookmarkStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        BookmarkStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        if (this.refs.myRef) 
        this.setState({ bookmarks: BookmarkStore.getBookmarks()});
    }
    
    

    render() {

        let bookmarks = this.state.bookmarks.map((result, index) => {
            
            return (
                <BookmarkResult result={result} index={index} key={index}/>
            );
        });
        return (
            
            <div className="row BookmarkResults" ref="myRef" >
                 

                    <div className="col-xs-12" >
                    <div className="span6">
                 
                        <h3> <i className="fa fa-star medium"></i> BOOKMARKS</h3>
                        {bookmarks}
        
                    </div>
                    </div>
                
                
            </div>
        )
    }
};