import React from "react";
import SearchActions from "../../../../actions/SearchActions";
import SearchStore from "../../SearchStore";
import Suggestions from "./components/Suggestions";
import Aspects from "./components/Aspects";

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
            aspects: [
                {key: 1, text: 'Aspect text 1', color: '#FDD'},
                {key: 2, text: 'Aspect text 2', color: '#DFD'},
                {key: 3, text: 'Aspect text 3', color: '#DDF'},
                {key: 4, text: 'Aspect text 4', color: '#FFC'},
            ],
            showSuggestions: false
        };

        this.changeHandler = this.changeHandler.bind(this);
    }

    // componentWillMount() {SuggestionStore.addChangeListener(this.changeHandler);}
    // componentWillUnmount() {SuggestionStore.removeChangeListener(this.changeHandler);}

    render() {
        return <div>
            <Suggestions
                suggestions={this.state.suggestions}
                clickHandler={this.props.clickSuggestionHandler}
            />
            <Aspects
                aspects={this.state.aspects}
                clickHandler={() => {}}
            />
        </div>
    }

    ////

    changeHandler() {
    }
}
