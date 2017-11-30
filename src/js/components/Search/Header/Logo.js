import './Logo.css'

import React from 'react';
import {Link} from 'react-router-dom';

import {log} from '../../../logger/Logger';
import {LoggerEventTypes} from '../../../constants/LoggerEventTypes';

class Logo extends React.Component {
    
    render() {
        
        return (
            <div>
                <Link to="/" onClick={this.clickHandler}>
                    <div className="Logo"></div>
                </Link>
            </div>
        )
    }

}

export default Logo;