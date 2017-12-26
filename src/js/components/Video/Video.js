import './Video.css';
import React from 'react';

import VideoPlayer from './VideoPlayer';
import AccountStore from '../../stores/AccountStore';
import TaskStore from '../../stores/TaskStore';

class Video extends React.Component {

    render () {
        const task = {
            topicId: AccountStore.getTopicId(),
            type: AccountStore.getTaskType(),
            duration: AccountStore.getTaskDuration()
        };

        return(
            <div className="Video row text-center" id="intro-video">
                <div className="col-xs-12">
                    <div className="Video-title">
                        <span className="Video-title-course">{TaskStore.getCourseTitle(task.topicId) + " : "}</span>
                        <span className="Video-title-topic">{TaskStore.getTopicTitle(task.topicId)}</span>
                    </div>

                    <VideoPlayer src={TaskStore.getTopicVideo(task.topicId)}/>
                </div>

                <hr/>


            </div>
        );
    }
}

export default Video;