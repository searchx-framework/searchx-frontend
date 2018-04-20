import React from "react";
import {Link} from "react-router-dom";

import TaskedSession from "../components/session/TaskedSession";
import constants from "./constants";

import AccountStore from "../../../stores/AccountStore";
import IntroStore from "../../../stores/IntroStore";



class Session extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            start: false,
            finished: false,
        };

        this.onFinish = this.onFinish.bind(this);
    }

    componentDidMount() {

        
        IntroStore.startIntro(introSteps, () => {
            const start = localStorage.getItem("timer-start") || Date.now();
            localStorage.setItem("timer-start", start);
            this.setState({
                start: start
            });
        });

    }

    render() {
        const task = AccountStore.getTask();

        return (
            <TaskedSession/>
        )
    }

    ////

    onFinish() {
        this.setState({
            finished: true
        });
    }
}


const introSteps = [
    {
        element: '.Task',
        intro:  
   "<h3> This is your task: </h3>" 
        
   + "<p> Imagine you are a reporter for a newspaper. Your editor has just asked you and your colleague[s] to gather documents"
   + " from a collection of news articles to write a story about [provided topic title]. </p>" 
   + "<br/>"
   + "<p> There's a meeting in an hour, so your editor asks you and your colleague[s] to spend 10 minutes together and search" 
   +  "for and save as many useful documents as possible.  </p>" 

   + "<p> To guarantee the quality of the documents, your editor, who will look over the collected resources in the end, " 
   + "requests that you use a collaborative search system (SearchX). </p>" 
   + "<p> Collect documents according to the following criteria: </p>" 
   + "<p> [topic narrative] </p>"

    },

    {
        element: '.Collapsible__trigger',
        intro:  "You can read the task description again here:",
        position: "left"
    },
    {
        element: '.SearchHeader',
        intro: 'We want you to use ou search system, SearchX.',
        position: 'bottom-middle-aligned'
    },
    {
        element: '.SearchHeader .form',
        intro: 'Use SearchX to search for news article about the topic.'
    },
    {
        element: '.QueryHistory',
        intro: 'The recent queries shows your and your group\'s past search queries. In this manner you see what the others are doing.',
        position: 'bottom'
    },
    {
        element: '.SearchResults',
        intro: 'The search results will appear here for your queries. You also see your group\'s saved documents here.',
        position: 'right'
    },
    {
        element: '.Bookmarks',
        intro: 'The documents you and your group saved will appear here. You can revisit them before completing the session.',
        position: 'top'
    },
    {
        element: '.Side',
        intro: 'The recent queries and saved documents are color-coded to show who initiated the action.',
        position: 'auto'
    }
];

export default Session;