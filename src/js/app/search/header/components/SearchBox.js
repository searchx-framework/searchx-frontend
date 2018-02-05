import './SearchHeader.pcss'
import React from 'react';

const SearchBox = function({query, changeHandler}) {
    const moveCursor = function(e) {
        // Places the cursor at the end of input
        e.target.value = e.target.value;
    };

    return (
        <div className="SearchHeader-form-box" id="intro-search-bar">
            <div className="input-group">
                <input type="text" className="form-control" name="query" placeholder=""
                       value={query}
                       onChange={e => changeHandler(e.target.value)}
                       onFocus={moveCursor}
                       autoComplete={'off'} autoFocus
                />
                    <span className="input-group-btn">
                        <button className="btn" type="submit" disabled={query.length === 0}>
                            <span className="fa fa-search"/>
                        </button>
                    </span>
            </div>
        </div>
    )
};

export default SearchBox;
