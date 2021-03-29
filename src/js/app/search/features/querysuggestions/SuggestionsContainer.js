import React from "react";
import Suggestions from "./components/Suggestions";
import SuggestionsStore from "./SuggestionsStore";

export default class SuggestionsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestions: [],
        };

        this.changeHandler = this.changeHandler.bind(this);
    }

    componentDidMount() {SuggestionsStore.addChangeListener(this.changeHandler);}
    componentWillUnmount() {SuggestionsStore.removeChangeListener(this.changeHandler);}

    render() {
        return <Suggestions
            suggestions={this.state.suggestions}
            clickHandler={this.props.clickSuggestionHandler}
            hideSuggestionsHandler={this.props.hideSuggestionsHandler}
            showSuggestions={this.props.showSuggestions}
        />
    }

    ////

    changeHandler() {
        this.setState({suggestions: SuggestionsStore.getSuggestions()});
    }
}
