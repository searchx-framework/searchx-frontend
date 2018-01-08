import './SearchHeader.css';
import React from 'react';

import Logo from './Logo';
import SearchBar from './SearchBar';

import account from '../../../stores/AccountStore';

////

export default class Header extends React.Component {

    render() {
        return (
            <div className="row SearchHeader" id="intro-system">
                <div className="col-sm-3 text-center SearchHeader-logo">
                    <Logo />
                </div>
                <div className="col-sm-9">
                    <SearchBar userId={account.getSessionId()}/>
                </div>
            </div>
        )
    }
}
