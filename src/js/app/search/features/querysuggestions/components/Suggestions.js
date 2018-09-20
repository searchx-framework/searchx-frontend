import './Suggestion.pcss';
import React from 'react';
import SuggestionItem from "./SuggestionItem";
import {ListGroup} from "react-bootstrap";

const Suggestions = function({suggestions, clickHandler, hideSuggestionsHandler, showSuggestions}) {
    const list = suggestions.map((data, index) => {
        return <SuggestionItem
            key={index}
            data={data}
            clickHandler={clickHandler}
        />
    });
    if (!showSuggestions) {
        return null;
    } else {
        return (
            <div>
                <div className="Suggestions">
                    <ListGroup>
                        {list}
                    </ListGroup>
                </div>
                <div className="ClickLayer" onClick={hideSuggestionsHandler}/>
            </div>
        )
    }
};

export default Suggestions;