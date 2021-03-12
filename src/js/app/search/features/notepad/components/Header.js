import React from "react";
import './Notepad.pcss';
import {Button} from "react-bootstrap";

const Header = function(props) {
    return (
        <header>
            <div className="btnSidebar">
                <Button variant="light" onClick={props.onClick}>Notepad</Button>
            </div>
        </header>
    );
};

export default Header;