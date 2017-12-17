import './Page.css';
import React from 'react';
import {log} from '../../utils/Logger';
import {LoggerEventTypes} from '../../constants/LoggerEventTypes';
import ReactIframeResizer from 'react-iframe-resizer-super';


const iframeResizerOptions = {
    // log: true,
    // autoResize: true,
    checkOrigin: false,
    // resizeFrom: 'parent',
    // heightCalculationMethod: 'max',
    // initCallback: () => { console.log('ready!'); },
    // resizedCallback: () => { console.log('resized!'); },
  };


let getParameterByName = function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");

    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    const results = regex.exec(url);

    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

export default class Page extends React.Component {

    constructor() {
        super();
        this.state = {url : window.location.href.split("url=")[1]}
    }


    componentWillMount(){
    }

  
    render() {
        
        return (
            <div className="row text-center">
            <div className="col-md-12">

                  
                
                </div>
            </div>
        )
    }
};