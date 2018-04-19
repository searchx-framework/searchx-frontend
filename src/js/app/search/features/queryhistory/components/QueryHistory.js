import './QueryHistory.pcss';
import React from 'react';
import QueryHistoryItem from "./QueryHistoryItem";

const QueryHistory = function({history, clickHandler}) {
    const list = history.map((data, index) => {
        return <QueryHistoryItem
            key={index}
            data={data}
            clickHandler={clickHandler}
        />
    });

    return (
        <div className="QueryHistory" id="intro-query-history">
            <h3> <i className="fa fa-history medium"/> Recent queries</h3>
            <div className="list">
                {list}
            </div>
        </div>
    )
};

export default QueryHistory;