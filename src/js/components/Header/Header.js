import './Header.css';

import React from 'react';

import Logo from './Logo';
import Search from './Search';
import Task from '../Task/Task';


export default class Header extends React.Component {
    render() {
        return (
            <div className="row Header">
                <div className="col-sm-12 col-sm-1 text-center Header-logo">
                    <Logo />
                </div>
                <div className="col-sm-12 col-sm-6">
                    <Search />
                </div>
                <div className="col-sm-12 col-sm-4 pull-right">
                    <Task />
                </div>
                
            </div>
        )
    }
}