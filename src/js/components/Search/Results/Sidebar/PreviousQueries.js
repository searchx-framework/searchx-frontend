import './Sidebar.css';
import React from 'react';

import SessionActions from "../../../../actions/SessionActions";
import SessionStore from "../../../../stores/SessionStore";
import PreviousQuery from "./PreviousQuery";

export default class QueryHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: SessionStore.getQueryHistory()
        };

        SessionActions.getQueryHistory();
        this._onChange = this._onChange.bind(this);
    }

    componentWillMount() {
        SessionStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        SessionStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState({
            history: SessionStore.getQueryHistory()
        });
    }

    ////

    render() {
        let history = this.state.history.map((data, index) => {
            return <PreviousQuery data={data} key={index}/>
        });

        ////

        return (
            <div className="PreviousQueries" id="intro-query-history">
                <h3> <i className="fa fa-history medium"/> QUERY HISTORY</h3>
                <div className="list">
                    {history}
                </div>
            </div>
        )
    }
};