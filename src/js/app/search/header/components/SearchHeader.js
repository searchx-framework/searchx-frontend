import './SearchHeader.pcss';
import React from 'react';

import Logo from './Logo';
import SearchBox from './SearchBox';
import SearchVerticals from './SearchVerticals';


const Header = function({query, vertical, provider, searchHandler, queryChangeHandler, verticalChangeHandler}) {
    return (
        <div className="SearchHeader" id="intro-system">
            <Logo />
            <form action="/" method="GET" className="form" onSubmit={e => {e.preventDefault();searchHandler();}}>
                <SearchBox query={query} changeHandler={queryChangeHandler}/>
                <SearchVerticals query={query} activeVertical={vertical} changeHandler={verticalChangeHandler} provider={provider}/>
            </form>

            
                {/* <Timer start={this.state.start} duration={constants.taskDuration} onFinish={this.onFinish} style={{fontSize: '2em'}}/> */}
            
        </div>
    )
};

export default Header;