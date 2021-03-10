import React from "react";
import QueryHistory from "./components/QueryHistory";

import SearchActions from "../../../../actions/SearchActions";
import SessionActions from "../../../../actions/SessionActions";
import QueryHistoryStore from "./QueryHistoryStore";
import SessionStore from "../../../../stores/SessionStore";
import AccountStore from "../../../../stores/AccountStore";

function queryClickHandler(query) {
    SearchActions.search(query, undefined, 1);
}

export default class QueryHistoryContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [],
            popup: false
        };

        SessionActions.getQueryHistory();
        this.changeHandler = this.changeHandler.bind(this);
        this.popupHandler = this.popupHandler.bind(this);
    }

    componentDidMount() {QueryHistoryStore.addChangeListener(this.changeHandler);}
    componentWillUnmount() {QueryHistoryStore.removeChangeListener(this.changeHandler);}
    shouldComponentUpdate(nextProps, nextState) {
        return this.state !== nextState;
    }

    render() {
        return <QueryHistory
            history={this.state.history}
            popup={this.state.popup}
            clickHandler={queryClickHandler}
            popupHandler={this.popupHandler}
        />
    }

    ////

    changeHandler() {
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

    popupHandler() {
        this.setState({
            popup: !this.state.popup
        });
    }
}