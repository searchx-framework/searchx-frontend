import './SearchHeader.pcss';
import React from 'react';

import Logo from './Logo';
import SearchBox from './SearchBox';
import SearchVerticals from './SearchVerticals';

const Header = function({query, vertical, searchHandler, queryChangeHandler, verticalChangeHandler}) {
    return (
        <div className="SearchHeader">
            <Logo />
            <form action="/" method="GET" className="form" onSubmit={e => {e.preventDefault();searchHandler();}}>
                <SearchBox query={query} changeHandler={queryChangeHandler}/>
                <SearchVerticals query={query} activeVertical={vertical} changeHandler={verticalChangeHandler}/>
            </form>
        </div>
    )
};

export default Header;