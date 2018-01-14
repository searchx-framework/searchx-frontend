import './Sidebar.css';

import React from 'react';
import AppActions from "../../../../AppActions";
import AccountStore from "../../../../stores/AccountStore";
import TaskStore from "../../../../stores/TaskStore";
import SessionStore from "../../../../stores/SessionStore";

export default class QueryHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: SessionStore.getQueryHistory()
        };

        AppActions.getQueryHistory();
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
            const url = window.location.href.split("?")[0];
            const href = url + "?q=" + data.query;

            let color = "DarkSlateGray";
            if (AccountStore.isCollaborative() && TaskStore.isIntroSearchDone()) {
                color = AccountStore.getMemberColor(data.userId);
            }

            return (
                <div className="QueryHistory-result" key={index} style={{borderColor: color}}>
                    <span className="text">
                        <span style={{color: 'gray'}}>{new Date(data.created).toLocaleTimeString()}</span>
                        <a style={{color: color}} href={href}>{data.query}</a>
                    </span>
                </div>
            );
        });

        ////

        return (
            <div className="QueryHistory" id="intro-query-history">
                <h3> <i className="fa fa-history medium"/> QUERY HISTORY</h3>
                <div className="list">
                    {history}
                </div>
            </div>
        )
    }
};