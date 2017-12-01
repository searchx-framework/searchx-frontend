import './Header.css';
import React from 'react';

import Logo from './Logo';
import Search from './SearchBar';
import Task from '../../Survey/Task';

import account from '../../../stores/AccountStore';

////

var steps = [
    {
        element: '#intro-task',
        intro: 'In the learning phase, you will need to use this system to learn about the given topic.'
    },
    {
        element: '#intro-search-bar',
        intro: 'We have provided a custom search engine to help you learn about the topic.'
    },
    {
        element: '#intro-counter',
        intro: 'You will need to learn about the topic for a given time. Afterwards, you can press the button to take the final test.'
    }
];

var intro = introJs().setOptions({
    steps: steps,
    doneLabel:  "Ok!",  
    showStepNumbers: false, 
    showBullets: false
});

////

export default class Header extends React.Component {

    componentDidMount(){
        // TODO : prevent re running intro through logs / elapsed
        intro.start();
    }
    
    render() {
        var task = {
            topicId: account.getTopicId(),
            type: account.getTaskType(),
            duration: account.getTaskDuration()
        }

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
