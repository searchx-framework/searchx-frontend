import './Viewer.pcss';
import React from 'react';

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';

import ViewerPage from "./ViewerPage";
import AnnotationContainer from "../../../features/annotation/AnnotationContainer";
import RatingContainer from "../../../features/rating/RatingContainer";
import Modal from "../../../../common/Modal";

import config from '../../../../../config';

const Viewer = function({searchState, serpId, url, documentCloseHandler, doctext}) {
    if (url === "") {
        return <div/>
    }

    ////

    const metaInfo = {
        url: url,
        query: searchState.query,
        page: searchState.page,
        vertical: searchState.vertical
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
    };
    let loadDocument = () => {
        log(LoggerEventTypes.DOCUMENT_LOAD, metaInfo);
        if (!doctext) {
            document.getElementById("viewer-content-loader").style.display = "none";
        }
    };
    let openInBrowser = () => {
        log(LoggerEventTypes.DOCUMENT_OPEN_BROWSER, metaInfo);
        window.open(url);
    };

    let scrollDocument = () => {
        log(LoggerEventTypes.DOCUMENT_SCROLL, metaInfo);
    };

    return (
        <Modal width="95%" height="90%">
            <div className="viewer" onMouseEnter={hoverEnterDocument} onMouseLeave={hoverLeaveDocument} onScroll={scrollDocument}>
                <div className="header">


                    <div className="pull-right">
                        {!doctext && [
                                <span className="forward" onClick={openInBrowser}>open in browser</span>,
                                <span className="divider"/>
                        ]}
                        {config.interface.ratings && [
                            <RatingContainer url={url}/>,
                            <span className="divider"/>
                        ]}
                        <span className="close" onClick={closeDocument}><i className="fa fa-times"/></span>
                    </div>
                </div>

                <div className="body">
                    {config.interface.annotations && (
                        <div className="sidebar">
                            <AnnotationContainer url={url}/>
                        </div>
                    )}

                    <ViewerPage url={url} loadHandler={loadDocument} doctext={doctext} />
                </div>
            </div>
        </Modal>
    );
};

export default Viewer;