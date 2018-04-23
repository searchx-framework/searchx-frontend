import React from "react";
import QueryHistory from "./components/QueryHistory";

import SearchActions from "../../../../actions/SearchActions";
import SessionActions from "../../../../actions/SessionActions";
import QueryHistoryStore from "./QueryHistoryStore";
import SessionStore from "../../../../stores/SessionStore";
import BookmarkStore from "../bookmark/BookmarkStore";
import AccountStore from "../../../../stores/AccountStore";

function queryClickHandler(query) {
    SearchActions.search(query, undefined, 1);
}

export default class QueryHistoryContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: []
        };

        SessionActions.getQueryHistory();
        this._onChange = this._onChange.bind(this);
    }

    componentWillMount() {QueryHistoryStore.addChangeListener(this._onChange);}
    componentWillUnmount() {QueryHistoryStore.removeChangeListener(this._onChange);}
    _onChange() {
        let history = QueryHistoryStore.getQueryHistory();
        if (!this.props.collaborative) {
            history = history.filter((data) => {
                return data.userId === AccountStore.getUserId();
            });
        }
        history = history.map((data) => {
            data.userColor = SessionStore.getMemberColor(data.userId);
            return data;
        });
        this.setState({
            history: history
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