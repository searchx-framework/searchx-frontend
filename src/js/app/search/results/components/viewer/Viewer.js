import './Viewer.pcss';
import React from 'react';

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';

import ViewerPage from "./ViewerPage";
import AnnotationContainer from "../../../features/annotation/AnnotationContainer";
import RatingContainer from "../../../features/rating/RatingContainer";
import Modal from "../../../../common/Modal";

const Viewer = function({searchState, serpId, url, documentCloseHandler}) {
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
        document.getElementById("viewer-content-loader").style.display = "block";
    };
    let loadDocument = () => {
        log(LoggerEventTypes.DOCUMENT_LOAD, metaInfo);
        document.getElementById("viewer-content-loader").style.display = "none";
    };
    let openInBrowser = () => {
        log(LoggerEventTypes.DOCUMENT_OPEN_BROWSER, metaInfo);
        window.open(url);
    };

    return (
        <Modal width="95%" height="90%">
            <div className="viewer" onMouseEnter={hoverEnterDocument} onMouseLeave={hoverLeaveDocument}>
                <div className="header">
                    <span className="title">{url}</span>

                    <div className="pull-right">
                        <span className="forward" onClick={openInBrowser}>open in browser</span>
                        <span className="divider"/>
                        <RatingContainer url={url}/>
                        <span className="divider"/>
                        <span className="close" onClick={closeDocument}><i className="fa fa-times"/></span>
                    </div>
                </div>

                <div className="body">
                    <ViewerPage url={url} loadHandler={loadDocument} />

                    <div className="sidebar">
                        <AnnotationContainer url={url}/>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default Viewer;