import './SearchHeader.pcss';
import React from 'react';
import Helpers from "../../../../utils/Helpers";
import {Button} from "react-bootstrap";

const AccountInfo = function({userId, groupId}) {
    return (
        <div className="AccountInfo">
            
            <p className="userId">User id: {userId} </p>
            <p className="groupId" > Group id: <a href={process.env.REACT_APP_PUBLIC_URL + "/search?groupId=" + groupId}>{groupId}</a> <i className="fa fa-question-circle" title="Share the group link with others to start a collaborative session. If you wish to test out a session with multiple users yourself you can open an incognito/private window."/>
            <Button variant="light" className="resetGroupButton" bssize="xs" href={process.env.REACT_APP_PUBLIC_URL + "/search?groupId=" + Helpers.generateId()}>Reset group</Button>
            </p>
            
        </div>
    )
};

export default AccountInfo;