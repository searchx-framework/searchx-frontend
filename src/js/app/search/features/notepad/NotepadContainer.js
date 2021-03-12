import React from 'react';
import Notepad from './components/Notepad'
import Header from "./components/Header";
import './components/Notepad.pcss'

import AccountStore from "../../../../stores/AccountStore";

function getPadUrl(){
    let url = 'SearchXtesting';
    if (AccountStore.getGroupId() === AccountStore.getSessionId()){
        url = AccountStore.getGroupId();
    }
    return url;
}

export default class NotepadContainer extends React.Component {
    constructor(props) {
        super(props);
        this.handleViewSidebar = this.handleViewSidebar.bind(this);
        this.padUrl = getPadUrl();
        this.state = {sidebarOpen: false};
    }

    handleViewSidebar(){
        this.setState({sidebarOpen: !this.state.sidebarOpen});
        let margin = window.innerWidth/3 * !this.state.sidebarOpen;
        document.getElementById("root").style.marginRight = margin+15 + "px";
    }

    render() {
        return (
            <div className="Parent">
                <Header onClick={this.handleViewSidebar} />
                <Notepad isOpen={this.state.sidebarOpen} toggleSidebar={this.handleViewSidebar} padUrl={this.padUrl}/>
            </div>
        );
    }
};


