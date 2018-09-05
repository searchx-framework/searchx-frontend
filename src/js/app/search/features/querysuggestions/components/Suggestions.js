import './Suggestion.pcss';
import React from 'react';
import SuggestionItem from "./SuggestionItem";

const Suggestions = function({suggestions, clickHandler}) {
    const list = suggestions.map((data, index) => {
        return <SuggestionItem
            key={index}
            data={data}
            clickHandler={clickHandler}
        />
    });

    return (
        <div className="Suggestions">
            <div className="list">
                {list}
            </div>
        </div>
    )
};

export default Suggestions;