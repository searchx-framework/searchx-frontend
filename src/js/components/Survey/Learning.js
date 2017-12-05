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
        intro: 'Read the task description.'
    },
    {
        element: '#intro-topic',
        intro: 'This is your topic.',
        position: 'left'
    },
    {
        element: '#intro-terms',
        intro: 'These are key terms/phrases about this topic that you may use to formulate your queries.'
    },
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
        intro: 'We want you to use our custom web search system (we call it "SearchX") to explore more about the given topic.',
        position: 'bottom-middle-aligned'
    },
    {
        element: '#intro-search-bar',
        intro: 'Use this tool to search for documents about the topic - and to browse/read them of course.'
    }
];

const stepsSubmit = [
    {
        element: '#intro-counter',
        intro: 'You will need to learn about the topic for 15 minutes. Afterwards, you can press the button to take the final test. Good luck and have fun!'
    }
];

////

const intro = introJs().setOptions({
    doneLabel:  "Ok!",
    showStepNumbers: false,
    showBullets: false
});

intro.oncomplete(function() {
    const start = localStorage.getItem("counter-start") || Date.now();

    localStorage.setItem("intro", true);
    localStorage.setItem("counter-start",start);
    location.reload();
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
        if (!localStorage.getItem("intro")) {
            intro.setOption('steps', this.state.steps);
            intro.start();
        }
    }

    render() {
        return(
            <div className="Learning row">
                <div className="Learning-medium col-md-9">
                    {this.state.medium}
                </div>

                <div className="Learning-task col-md-3">
                    <Task task={this.state.task}/>
                </div>
            </div>
        );
    }
}

export default Learning;
