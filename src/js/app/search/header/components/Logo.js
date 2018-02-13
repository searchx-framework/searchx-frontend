import './SearchHeader.pcss'
import React from 'react';
import {Link} from 'react-router-dom';

const Logo = function() {
    return (
        <div className="logo">
            <Link to="/">
                <div className="image"/>
            </Link>
        </div>
    )
};

export default Logo;