import React from "react";
import SearchActions from "../../../../actions/SearchActions";
import SearchStore from "../../SearchStore";
import Suggestions from "./components/Suggestions";

export default class SuggestionsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestions: [{
                query: 'test query',
                score1: 0.5,
                score2: 0.6
            },{
                query: 'test query 2',
                score1: 0.2,
                score2: 0.9
            },{
                query: 'test query 3',
                score1: 0.0,
                score2: 1.0
            },{
                query: 'test query 4',
                score1: 0.3,
                score2: 0.4
            },{
                query: 'test query 5',
                score1: 0.6,
                score2: 0.8
            }],
            showSuggestions: false
        };

        this.changeHandler = this.changeHandler.bind(this);
    }

    // componentWillMount() {SuggestionStore.addChangeListener(this.changeHandler);}
    // componentWillUnmount() {SuggestionStore.removeChangeListener(this.changeHandler);}

    render() {
        return <Suggestions
            suggestions={this.state.suggestions}
            clickHandler={this.props.clickSuggestionHandler}
        />
    }

    ////

    changeHandler() {
    }
}
