import './Modal.pcss';
import React from 'react';

const Modal = function({width, height, children}) {
    return(
        <div className="modal">
            <div className="content" style={{height: height, width: width}}>
                {children}
            </div>
        </div>
    );
};

Modal.defaultProps = {
    width: "90%",
    height: "95%"
};

export default Modal;