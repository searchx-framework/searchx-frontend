import React from "react";
import QueryHistory from "./components/QueryHistory";

import SearchActions from "../../../../actions/SearchActions";
import SessionActions from "../../../../actions/SessionActions";
import QueryHistoryStore from "./QueryHistoryStore";
import SessionStore from "../../../../stores/SessionStore";

function queryClickHandler(query) {
    SearchActions.search(query);
}

export default class QueryHistoryContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            history: []
        };

        SessionActions.getQueryHistory();
        this._onChange = this._onChange.bind(this);
    }

    componentWillMount() {QueryHistoryStore.addChangeListener(this._onChange);}
    componentWillUnmount() {QueryHistoryStore.removeChangeListener(this._onChange);}
    _onChange() {
        this.setState({
            history: QueryHistoryStore.getQueryHistory().map((data) => {
                data.userColor = SessionStore.getMemberColor(data.userId);
                return data;
            })
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state !== nextState;
    }

    render() {
        return <QueryHistory
            history={this.state.history}
            clickHandler={queryClickHandler}
        />
    }
}