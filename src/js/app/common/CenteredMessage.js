import './CenteredMessage.pcss';
import React from 'react';

const CenteredMessage = function({height, style, children}) {
    return (
        <div className='CenteredMessage' style={{height: height}}>
            <div className='content' style={style}>
                {children}
            </div>
        </div>
    )
};

CenteredMessage.defaultProps = {
    height: "100%",
    style: {}
};

export default CenteredMessage;