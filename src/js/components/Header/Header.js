import './Header.css'

import React from 'react';

import Logo from './Logo';
import Search from './Search'


export default class Header extends React.Component {
    render() {
        return (
            <div className="row Header">
                <div className="col-xs-12 col-sm-1 text-center Header-logo">
                    <Logo />
                </div>
                <div className="col-sm-12 col-md-6">
                    <Search />
                </div>
                
            </div>
        )
    }
}