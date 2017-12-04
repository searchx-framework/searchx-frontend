import './Logo.css'

import React from 'react';
import {Link} from 'react-router-dom';

class Logo extends React.Component {
    
    render() {
        return (
            <div>
                <Link to="/" onClick={this.clickHandler}>
                    <div className="Logo"/>
                </Link>
            </div>
        )
    }
}

export default Logo;