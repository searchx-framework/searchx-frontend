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
            history: [],
            popup: false
        };

        SessionActions.getQueryHistory();
        this.changeHandler = this.changeHandler.bind(this);
        this.popupHandler = this.popupHandler.bind(this);
    }

    componentWillMount() {QueryHistoryStore.addChangeListener(this.changeHandler);}
    componentWillUnmount() {QueryHistoryStore.removeChangeListener(this.changeHandler);}
    componentWillReceiveProps(nextProps) {
        if (this.state.popup) {
            this.setState({
                popup: false
            });
        }
    }
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
        this.setState({
            history: QueryHistoryStore.getQueryHistory().map((data) => {
                data.userColor = SessionStore.getMemberColor(data.userId);
                return data;
            })
        });
    }

    popupHandler() {
        this.setState({
            popup: !this.state.popup
        });
    }
}