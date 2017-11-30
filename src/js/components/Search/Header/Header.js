import './Header.css';
import React from 'react';

import Logo from './Logo';
import Search from './SearchBar';
import Task from '../../Survey/Task';

import account from '../../../stores/AccountStore';

////

export default class Header extends React.Component {
    render() {
        var task = {
            topicId: account.getTopicId(),
            type: account.getTaskType(),
            duration: account.getTaskDuration()
        }

        var topicId = account.getTopicId();
        return (
            <div className="row Header">
                <div className="col-sm-12 col-sm-1 text-center Header-logo">
                    <Logo />
                </div>
                <div className="col-sm-12 col-sm-4">
                    <Search userId={account.getId()} task={task} />
                </div>
                {task.topicId &&
                    <div className="col-sm-12 col-sm-5 pull-right">
                        <Task userId={account.getId()} task={task} />
                    </div>
                }
            </div>
        )
    }
}
