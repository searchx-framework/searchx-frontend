import React from 'react';
import Loader from 'react-loader';

const env = require('env');
const isImage = require('is-image');

const ViewerPage = function({url, loadHandler}) {
    return(
        <div className="page">
            <div id="modal-loader">
                <Loader/>
            </div>

            {isImage(url) ?
                <img src={url} onLoad={loadHandler}/>
                :
                <iframe scrolling="yes"
                        frameBorder="0"
                        src={env.renderUrl + '/' + url}
                        onLoad={loadHandler}>
                </iframe>
            }
        </div>
    );
};

export default ViewerPage;