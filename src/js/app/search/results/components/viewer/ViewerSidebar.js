import React from 'react';
import AnnotationsContainer from "../../../features/annotations/AnnotationsContainer";

const ViewerSidebar = function({url}) {
    return (
        <div className="sidebar">
            <AnnotationsContainer url={url}/>
        </div>
    );
};

export default ViewerSidebar;