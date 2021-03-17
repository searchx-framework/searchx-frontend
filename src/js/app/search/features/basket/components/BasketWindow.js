import React from 'react';
import Modal from "../../../../common/Modal";

const BasketWindow = function({active, list, closeHandler}) {
    if (!active) {
        return <div/>;
    }

    return (
        <Modal width="600px" height="90%">
            <div className="popup">
                <div className="header">
                    <span className="title"><i className="fa fa-shopping-cart medium"/> Shopping basket</span>
                    <div className="float-right">
                        <span className="close" onClick={closeHandler}><i className="fa fa-times"/></span>
                    </div>
                </div>

                <div className="body">
                    <div className="list">
                        {list}
                    </div>
                </div>
            </div>
        </Modal>
    )
};

export default BasketWindow;