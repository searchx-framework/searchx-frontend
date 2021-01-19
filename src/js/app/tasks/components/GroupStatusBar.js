import React from 'react';
import Identicon from "identicon.js";
import md5 from 'md5';

import SessionStore from '../../../stores/SessionStore';

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

            return <img src={iconUrl} className="user" style={{marginRight: 5 + 'px'}} title={"Anonymous User  " + md5(data.userId)} alt={"Anonymous User " + md5(data.userId)}/> 
        });

        return (
            <div className="StatusBar" >
                {list}
            </div>
        )
    }
}

export default GroupStatusBar;