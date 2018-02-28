import React from "react";
import {Link} from "react-router-dom";
import TaskedSession from "../components/session/TaskedSession";

import AccountStore from "../../../stores/AccountStore";
import IntroStore from "../../../stores/IntroStore";

class Session extends React.PureComponent {
    componentDidMount() {
        IntroStore.startIntro(introSteps, () => {});
    }

    render() {
        const task = AccountStore.getTask();

        return (
            <TaskedSession disableCopy={true}>
                <div className="box" style={{marginBottom: '20px', textAlign: 'center'}}>
                    <Link className={"btn btn-primary"} to="/async/feedback" role="button">
                        To Feedback
                    </Link>
                </div>

                <div className="box" style={{flexGrow: '1'}}>
                    <h3 style={{textAlign: 'center'}}>{task.data.title}</h3>
                    <hr/>
                    <p>{task.data.description}</p>
                </div>
            </TaskedSession>
        )
    }
}

const introSteps = [
    {
        element: '.Task',
        intro: 'Please take a minute to read your task description.',
        position: 'left'
    },
    {
        element: '.SearchHeader',
        intro: 'We want you to use our custom web search system SearchX.',
        position: 'bottom-middle-aligned'
    },
    {
        element: '.SearchHeader .form',
        intro: 'Use SearchX to search for webpages, publications, and other online sources about the topic.'
    },
    {
        element: '.QueryHistory',
        intro: 'The query history shows your and your group\'s past search queries. In this manner you see what the others are doing.',
        position: 'top'
    },
    {
        element: '.SearchResults',
        intro: 'To save a resource that is useful, bookmark it. You also see your group\'s bookmarks here.',
        position: 'top'
    },
    {
        element: '.Bookmarks',
        intro: 'The documents you and your group bookmarked will appear here. You can revisit them before completing the session.',
        position: 'top'
    },
    {
        element: '.Search .Content',
        intro: 'The query history and bookmarks are color-coded to show who initiated the action.',
        position: 'top'
    },
    {
        intro: 'Please use the provided chat window to collaborate with your group during the session.',
        position: 'auto'
    }
];

export default Session;