import './Video.pcss';
import React from 'react';
import Alert from 'react-s-alert';

import VideoPlayer from './VideoPlayer';
import LearningStore from '../LearningStore';
import AccountStore from '../../../../stores/AccountStore';

import {log} from '../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../utils/LoggerEventTypes';

class Video extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isComplete: false
        };
    }

    componentDidMount() {
        document.addEventListener('visibilitychange', function(){
            log(LoggerEventTypes.WINDOW_CHANGE_VISIBILITY, {
                step : "video",
                hidden: document.hidden

            });
            
            if (document.hidden) {
                let switchTabs = -1;
                if (localStorage.getItem("switchTabsVideo") !== null) {
                    switchTabs = localStorage.getItem("switchTabsVideo");
                }

                switchTabs++;
                localStorage.setItem("switchTabsVideo", switchTabs);

                ////

                let times = '';
                if (switchTabs === 1) {
                    times = 'once.';
                } else if (switchTabs === 2) {
                    times = 'twice.';
                } else {
                    times = switchTabs + " times." 
                }

                Alert.error('We have noticited that you have tried to change to a different window/tab.', {
                    position: 'bottom-right',
                    effect: 'scale',
                    beep: true,
                    timeout: "none",
                    offset: 100
                });

                Alert.error('Please, focus on completing watching the course video.', {
                    position: 'bottom-right',
                    effect: 'scale',
                    beep: true,
                    timeout: "none",
                    offset: 100
                });

                Alert.error('Remember that more than three tab changes result in non-payment. So far you have changed tabs ' + times, {
                    position: 'bottom-right',
                    effect: 'scale',
                    beep: true,
                    timeout: "none",
                    offset: 100
                });

                ////
                
                if (switchTabs >= 3) {
                    window.location.reload();
                }
            }
        })
    }

    render () {
        const task = {
            topic: AccountStore.getTaskTopic(),
            type: AccountStore.getTaskType(),
            duration: AccountStore.getTaskDuration()
        };

        return(
            <div className="Video text-center" id="intro-video">
                <VideoPlayer src={LearningStore.getTopicVideo(task.topic)}/>
                <hr/>
            </div>
        );
    }
}

export default Video;