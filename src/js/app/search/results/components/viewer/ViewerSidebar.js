import React from 'react';
import AnnotationContainer from "../../../features/annotation/AnnotationContainer";

const ViewerSidebar = function({url}) {
    return (
        <div className="sidebar">
            <AnnotationContainer url={url}/>
        </div>
    );
};

export default ViewerSidebar;