import React from 'react';

const AnnotationItem = function({index, data, removeHandler, userId}) {
    const date = new Date(data.created);
    const dateString = date.toLocaleTimeString() + " . " + date.toLocaleDateString();

    return (
        <div className="item" style={{borderColor: data.userColor}}>
            <div className="text">{data.annotation}</div>
            <div className="info">
                <span className="created">{dateString}</span>
                {userId === data.userId && data._id &&
                <span className="close" onClick={() => removeHandler(index)}><i className="fa fa-trash"/></span>
                }
            </div>
        </div>
    )
};

export default AnnotationItem;