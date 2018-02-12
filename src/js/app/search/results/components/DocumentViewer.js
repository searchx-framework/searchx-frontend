import './DocumentViewer.pcss';

import React from 'react';
import Loader from 'react-loader';

const env = require('env');
const isImage = require('is-image');

import {log} from '../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../utils/LoggerEventTypes';

const DocumentViewer = function({searchState, serpId, url, documentCloseHandler}) {
    if (url === "") {
        return <div/>
    }

    ////

    const metaInfo = {
        url: url,
        query: searchState.query,
        page: searchState.page,
        vertical: searchState.vertical,
        serpId: serpId,
    };

    let hoverEnterDocument = () => {
        log(LoggerEventTypes.DOCUMENT_HOVERENTER, metaInfo)
    };
    let hoverLeaveDocument = () => {
        log(LoggerEventTypes.DOCUMENT_HOVERLEAVE,metaInfo)
    };
    let closeDocument = () => {
        documentCloseHandler();
        log(LoggerEventTypes.DOCUMENT_CLOSE, metaInfo);
        document.getElementById("modal-loader").style.display = "block";
    };
    let loadDocument = () => {
        log(LoggerEventTypes.DOCUMENT_LOAD, metaInfo);
        document.getElementById("modal-loader").style.display = "none";
    };
    let openInBrowser = () => {
        log(LoggerEventTypes.DOCUMENT_OPEN_BROWSER, metaInfo);
        window.open(url);
    };

    return (
        <div className="modal">
            <div className="content" onMouseEnter={hoverEnterDocument} onMouseLeave={hoverLeaveDocument}>
                <div className="header">
                    <span className="title">{url}</span>
                    <span className="close" onClick={closeDocument}>&times;</span>
                    <span className="forward" onClick={openInBrowser}>open in browser</span>
                </div>

                <div id="modal-loader">
                    <Loader/>
                </div>
                <div className="result">
                    {url !== "" && !isImage(url) &&
                        <iframe scrolling="yes"
                                frameBorder="0"
                                src={env.renderUrl + '/' + url}
                                onLoad={loadDocument}>
                        </iframe>
                    }

                    {url !== "" && isImage(url) &&
                        <img src={url} onLoad={loadDocument}/>
                    }
                </div>
            </div>
        </div>
    );
};

export default DocumentViewer;