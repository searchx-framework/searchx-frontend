import './QueryHistory.pcss';
import React from 'react';
import QueryHistoryItem from "./QueryHistoryItem";
import QueryHistoryWindow from "./QueryHistoryWindow";

const QueryHistory = function({history, popup, clickHandler, popupHandler}) {
    const list = history.map((data, index) => {
        return <QueryHistoryItem
            key={index}
            data={data}
            clickHandler={clickHandler}
        />
    });

    return (
        <div className="QueryHistory">
            <h3 className="banner" onClick={popupHandler}>
                <i className="fa fa-history medium"/> Recent queries
            </h3>

            <div className="list">
                {list}
            </div>

            <QueryHistoryWindow
                active={popup}
                list={list}
                closeHandler={popupHandler}
            />
        </div>
    )
};

export default QueryHistory;