import React from 'react';
import Modal from "../../common/Modal";

const TaskBarWindow = function({active, taskDescription, closeHandler}) {
    if (!active) {
        return <div/>;
    }

    return (
        <Modal width="600px" height="90%">
            <div className="popup">
                <div className="header">
                    <span className="title"><i className="fa fas fa-tasks medium"/> Task description
                    <div className="float-right">
                        <span className="close" onClick={closeHandler}><i className="fa fa-times"/></span>
                    </div>
                    </span>
                </div>

                <div className="body">
                    {taskDescription}
                </div>
            </div>
        </Modal>
    )
};

export default TaskBarWindow;