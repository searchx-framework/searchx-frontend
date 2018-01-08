import './Sidebar.css';

import React from 'react';
import SearchStore from '../../../../stores/SearchStore';
import AccountStore from "../../../../stores/AccountStore";
import TaskStore from "../../../../stores/TaskStore";

export default class QueryHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: SearchStore.getQueryHistory()
        };

        this._onChange = this._onChange.bind(this);
    }

    componentWillMount() {
        SearchStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        SearchStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState({
            history: SearchStore.getQueryHistory()
        });
    }

    ////

    render() {
        let history = this.state.history.map((data, index) => {
            const url = window.location.href.split("?")[0];
            const href = url + "?q=" + data.query;

            let color = "DarkSlateGray";
            if (AccountStore.isCollaborative() && TaskStore.isIntroDone()) {
                color = AccountStore.getMemberColor(data.userId);
            }

            return (
                <div className="QueryHistory-result" key={index} style={{borderColor: color}}>
                    <a style={{color: color}} href={href}>
                        {data.query}
                    </a>
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