import React from 'react';
import Loader from 'react-loader';
import isImage from 'is-image';

const ViewerPage = function({url, loadHandler}) {
    return(
        <div className="page">
            <div id="viewer-content-loader">
                <Loader/>
            </div>

            {isImage(url) ?
                <img src={url} onLoad={loadHandler}/>
                :
                <iframe scrolling="yes"
                        frameBorder="0"
                        src={`${process.env.REACT_APP_RENDERER_URL}/${url}`}
                        onLoad={loadHandler}>
                </iframe>
            }
        </div>
    );
};

export default ViewerPage;