import './SearchHeader.pcss';
import React from 'react';
import Helpers from "../../../../utils/Helpers";
import {Button} from "react-bootstrap";

const AccountInfo = function({userId, groupId}) {
    return (
        <div className="AccountInfo">
            <p>User id: {userId}<br/>
                Group id: <a href={"http://searchx.ewi.tudelft.nl/search?groupId=" + groupId}>{groupId}</a> <i className="fa fa-question-circle" title="Share the group link with others to start a collaborative session. If you wish to test out a session with multiple users yourself you can open an incognito/private window."/>
            </p>
            <Button bsSize="small" href={"http://searchx.ewi.tudelft.nl/search?groupId=" + Helpers.generateId()}>Reset group</Button>
        </div>
    )
};

export default AccountInfo;