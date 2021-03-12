import './Notepad.pcss';
import React from 'react';
import Iframe from "react-iframe";


const Notepad = function(props) {
    const sidebarClass = props.isOpen ? 'sidebar open' : 'sidebar';
    const padUrl = "http://lambda4.ewi.tudelft.nl/p/" + props.padUrl + "?showControls=true&showChat=false&showLineNumbers=true&useMonospaceFont=false&withCredentials=true";
    return (
        <div className={sidebarClass}>
            {/*<Button variant="light" onClick={props.toggleSidebar} className="sidebar-toggle">Hide Document</Button>*/}
            <div>
                <Iframe url={padUrl}
                        // width="600px"
                        width={window.innerWidth/3}
                        height={window.innerHeight - 50}
                        id="embed_readwrite"
                        className="etherpadDoc"
                        display="initial"
                        position="relative"
                        overflow="auto"/>
            </div>
        </div>
    );
};

export default Notepad;


