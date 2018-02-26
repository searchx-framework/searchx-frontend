import './TaskedSession.pcss';
import React from 'react';
import Alert from "react-s-alert";
import PropTypes from "prop-types";
import Search from "../../../search/Search";

const TaskedSession = function({disableCopy, collaborative, style, children}) {
    function handleCutCopyPaste(e) {
        if (disableCopy) {
            Alert.warning('You cannot copy and paste during the session.', {
                position: 'top-right',
                effect: 'scale',
                beep: true,
                timeout: "none",
            });

            e.preventDefault();
        }
    }

    return(
        <div className="Session" onPaste={handleCutCopyPaste} onCut={handleCutCopyPaste} onCopy={handleCutCopyPaste}>
            <div className="Medium">
                <Search collaborative={collaborative}/>
            </div>

            <div className="Task" style={style}>
                <div className="body">
                    {children}
                </div>
            </div>
        </div>
    )
};

TaskedSession.propTypes = {
    disableCopy: PropTypes.bool,
    collaborative: PropTypes.bool
};

TaskedSession.defaultProps = {
    disableCopy: false,
    collaborative: true,
    style: {}
};

export default TaskedSession;