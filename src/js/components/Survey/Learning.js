import './Survey.css'
import React from 'react';

import Account from "../../stores/AccountStore";
import Search from "../Search/Search";
import Video from "../Video/Video";
import Task from "./Task/Task";

////

const stepsTask = [
    {
        element: '#intro-description',
        intro: 'Please, take a minute to read your task description.',
        position: 'left'
    }
];

const stepsVideo = [
    {
        element: '#intro-video',
        intro: 'We want you to watch a course video on the given topic.',
        position: 'bottom-middle-aligned'
    }
];

const stepsSearch = [
    {
        element: '#intro-system',
        intro: 'We want you to use our custom web search system (we call it "SearchX").',
        position: 'bottom-middle-aligned'
    },
    {
        element: '#intro-search-bar',
        intro: 'Use this tool to search for webpages, publications, and other online sources on the Web.'
    },
    {
        element: '#intro-search-results',
        intro: 'Use this tool to collect and save all the Webpages, publications, and other online sources that are helpful for you to write a paper.',
        position: 'right'
    },
    {
        element: '#intro-bookmark-bar',
        intro: 'The bookmarked documents will appear here in case you want to revisit them before completing the final test.',
        position: 'left'
    }
];

const stepsSubmit = [
    {
        element: '#intro-counter',
        intro: 'You will need to search and learn for 20 minutes. Afterwards, you can press the button to complete the final test. Good luck and have fun!',
        position: 'left'
    }
];

////

const intro = introJs().setOptions({
    doneLabel:  "Ok!",
    showStepNumbers: false,
    showBullets: false,
    exitOnOverlayClick: false
});

intro.oncomplete(function() {
    const start = localStorage.getItem("counter-start") || Date.now();

    localStorage.setItem("intro-done", true);
    localStorage.setItem("counter-start",start);
    location.href = "/learning/"
});

////

class Learning extends React.Component {

    constructor() {
        super();

        const task = {
            topicId: Account.getTopicId(),
            type: Account.getTaskType(),
            duration: Account.getTaskDuration()
        };

        ////

        let steps = stepsTask.concat(stepsSearch, stepsSubmit);
        let medium = <Search/>;

        if (task.type === 'video') {
            steps = stepsTask.concat(stepsVideo, stepsSubmit);
            medium = <Video/>;
        }

        if (task.type === 'both') {
            steps = stepsTask.concat(stepsVideo, stepsSearch, stepsSubmit);
            medium = (
                <div>
                    <Video/>
                    <hr/>
                    <Search/>
                </div>
            );
        }

        ////

        this.state = {
            task: task,
            medium: medium,
            steps: steps
        }
    }

    componentDidMount() {
        if (this.state.task.topicId && !localStorage.getItem("intro-done")) {
            intro.setOption('steps', this.state.steps);
            intro.start();
        }
    }

    render() {
        return(
            <div>
                {Account.getTopicId() !== "" &&
                    <div className="Learning row">
                        <div id="modal" className="Learning-medium col-md-9">
                            {this.state.medium}
                        </div>
                        
                        <div className="Learning-task col-md-3">
                            <Task task={this.state.task}/>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default Learning;
