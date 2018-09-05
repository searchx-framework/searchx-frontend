import './Suggestion.pcss';
import React from 'react';
import SuggestionItem from "./SuggestionItem";
import {ListGroup} from "react-bootstrap";

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
            <ListGroup>
                {list}
            </ListGroup>
        </div>
    )
};

export default Suggestions;