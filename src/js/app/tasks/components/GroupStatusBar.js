import React from 'react';
import Identicon from "identicon.js";
import md5 from 'md5';

import SessionStore from '../../../stores/SessionStore';
import ReactTooltip from 'react-tooltip';
import config from "../../../config";

class GroupStatusBar extends React.PureComponent {
    render () {
        const groupMembers = SessionStore.getGroupMembers();
        const list = Object.entries(groupMembers).map((data, index) => {
            data = data[1];
            let options = {
                size : 40
            }
            let icon = new Identicon(md5(data.userId), options).toString();
            let iconUrl = "data:image/png;base64," + icon 
            let title = config.groupMembersAnonymous ? "Anonymous User  " + md5(data.userId) : "User " +  data.userId 
            return <img src={iconUrl} className="user" style={{marginRight: 5 + 'px'}} title={title} data-tip={title} alt={iconUrl}/> 
        });

        return (
            <div className="StatusBar" >
                {list}
                <ReactTooltip  place="bottom" type="info" />
            </div>
        )
    }
}

export default GroupStatusBar;