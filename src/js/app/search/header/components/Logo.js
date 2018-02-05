import './SearchHeader.pcss'
import React from 'react';
import {Link} from 'react-router-dom';

const Logo = function() {
    return (
        <div className="SearchHeader-logo">
            <Link to="/">
                <div className="SearchHeader-logo-image"/>
            </Link>
        </div>
    )
};

export default Logo;