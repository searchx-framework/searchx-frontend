import './SearchHeader.pcss'
import React from 'react';
import config from '../../../../../js/config'
const Logo = function() {
    return (
        <div className="logo">
            <div className="image"/>
            <p className="dataset"> {config.dataset}</p>
        </div>
    )
};

export default Logo;