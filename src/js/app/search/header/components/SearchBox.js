import './SearchHeader.pcss'
import React from 'react';


const SearchBox = function({query, changeHandler, showSuggestionsHandler}) {
    return (
        <div className="box">
            <div className="input-group">
                <input type="text" className="form-control" name="query" placeholder=""
                       value={query}
                       onChange={e => changeHandler(e.target.value)}
                       autoComplete={'off'}
                       onFocus={showSuggestionsHandler}
                       onClick={showSuggestionsHandler}
                />

                <span className="input-group-btn">
                    <button className="btn rounded-0" type="submit" disabled={query.length === 0}>
                        <span className="fa fa-search"/>
                    </button>
                </span>
            </div>
        </div>
    )
};

export default SearchBox;
