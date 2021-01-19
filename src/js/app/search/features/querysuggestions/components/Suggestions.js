import './Suggestion.pcss';
import React from 'react';
import SuggestionItem from "./SuggestionItem";

const Suggestions = function({suggestions, clickHandler, hideSuggestionsHandler, showSuggestions}) {
    const suggestionItems = suggestions.map((data, index) => {
        return <SuggestionItem
            key={index}
            data={data}
            clickHandler={clickHandler}
        />
    });
    if (!showSuggestions || !suggestions || suggestions.length === 0) {
        return null;
    } else {
        return (
            <div>
                <div className="Suggestions">
                        {suggestionItems}
                </div>
                <div className="ClickLayer" onClick={hideSuggestionsHandler}/>
            </div>
        )
    }
};

export default Suggestions;