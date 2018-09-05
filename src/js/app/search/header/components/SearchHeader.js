import './SearchHeader.pcss';
import React from 'react';

import Logo from './Logo';
import SearchBox from './SearchBox';
import SearchVerticals from './SearchVerticals';
import AccountInfo from "./AccountInfo";
import SuggestionsContainer from "../../features/querysuggestions/SuggestionsContainer";


const Header = function ({query, vertical, provider, searchHandler, queryChangeHandler, verticalChangeHandler, timer, userId, groupId, showAccountInfo, hideSuggestionsHandler, showSuggestionsHandler, clickSuggestionHandler, showSuggestions}) {
    return (
        <div className="SearchHeader">
            <Logo/>
            <form action="/" method="GET" className="form" onSubmit={e => {
                e.preventDefault();
                searchHandler();
            }}>
                <SearchBox query={query} changeHandler={queryChangeHandler} showSuggestionsHandler={showSuggestionsHandler}/>
                {showSuggestions && [
                    <SuggestionsContainer clickSuggestionHandler={clickSuggestionHandler}/>,
                    <div className="ClickLayer" onClick={hideSuggestionsHandler}/>]}
                <SearchVerticals query={query} activeVertical={vertical} changeHandler={verticalChangeHandler}
                                 provider={provider}/>
            </form>
            {showAccountInfo && <AccountInfo userId={userId} groupId={groupId}/>}
            <div className="TimerDiv">
                {timer}
            </div>
        </div>
    )
};

export default Header;