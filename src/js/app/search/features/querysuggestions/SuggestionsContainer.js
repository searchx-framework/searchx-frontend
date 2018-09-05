import React from "react";
import SearchActions from "../../../../actions/SearchActions";
import SearchStore from "../../SearchStore";
import Suggestions from "./components/Suggestions";

function clickHandler(query) {
    SearchActions.search(query, SearchStore.getSearchState().vertical, 1)
}

export default class SuggestionsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestions: [{
                query: 'test query',
                score1: 0.5,
                score2: 0.6
            }]
        };

        this.changeHandler = this.changeHandler.bind(this);
    }

    // componentWillMount() {SuggestionStore.addChangeListener(this.changeHandler);}
    // componentWillUnmount() {SuggestionStore.removeChangeListener(this.changeHandler);}

    render() {
        return <Suggestions
            suggestions={this.state.suggestions}
            clickHandler={clickHandler}
        />
    }

    ////

    changeHandler() {
    }
}
