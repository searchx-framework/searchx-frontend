import './SearchHeader.css';
import React from 'react';

import Logo from './Logo';
import SearchBar from './SearchBar';

import account from '../../../stores/AccountStore';

////

const steps = [
    {
        element: '#intro-description',
        intro: 'Read the task description.'
    },
    {
        element: '#intro-system',
        intro: 'We want you to use our custom Web search system (we call it "SearchX") to learn about a given topic.',
        position: 'bottom-middle-aligned'
    },
    {
        element: '#intro-topic',
        intro: 'This is your topic.'
    },
    {
        element: '#intro-terms',
        intro: 'These are key terms/phrases about this topic that you may use to formulate your queries.'
    },
    {
        element: '#intro-search-bar',
        intro: 'Use this tool to search for documents about the topic - and to browse/read them of course.'
    },
    {
        element: '#intro-counter',
        intro: 'You will need to learn about the topic for 15 minutes. Afterwards, you can press the button to take the final test. Good luck and have fun!'
    }
];

const intro = introJs().setOptions({
    steps: steps,
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

export default class Header extends React.Component {

    componentDidMount(){
        if (!localStorage.getItem("intro")) {
            intro.start();
        }
    }
    
    render() {
        return (
            <div className="row SearchHeader" id="intro-system">
                <div className="col-sm-3 text-center SearchHeader-logo">
                    <Logo />
                </div>
                <div className="col-sm-9">
                    <SearchBar userId={account.getId()}/>
                </div>
            </div>
        )
    }
}
