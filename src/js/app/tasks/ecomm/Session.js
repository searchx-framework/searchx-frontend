import React from "react";
import {withRouter} from "react-router";

import TaskedSession from "../components/session/TaskedSession";
import constants from "./constants";

import AccountStore from "../../../stores/AccountStore";
import IntroStore from "../../../stores/IntroStore";
import Timer from "../components/Timer";
import TaskBar from "../components/TaskBar";
import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../utils/LoggerEventTypes';
import StatusBar from "../components/GroupStatusBar";
import {getTaskDescription} from "./Utils";
import SearchActions from "../../../actions/SearchActions";
import config from "../../../config";

class Session extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            start: false,
            currentTopic: parseInt(localStorage.getItem("current-topic")) 
        };
        this.onFinish = this.onFinish.bind(this);
        this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.handleBeforeUnload);

        IntroStore.startIntro(getIntroSteps(), () => {
            const start = localStorage.getItem("timer-start") || Date.now();
            localStorage.setItem("timer-start", start);
            this.setState({
                start: start
            });
        });
        if (this.state.currentTopic > 0) {
            SearchActions.reset();
        }
        var audio = new Audio("/sounds/notification.mp3");
        audio.play();
    }
    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        window.removeEventListener('popstate', this.handleBeforeUnload);
    }

    handleBeforeUnload(e) {
        const dialogText = 'Leaving this page will quit the task. Are you sure?';
        e.returnValue = dialogText;
        return dialogText;
    }

    render() {
        
        if (localStorage.getItem("current-path") !== '/ecomm/session') {
            this.props.history.replace({
                pathname: localStorage.getItem("current-path")
            });
        }
        
        const task = AccountStore.getTask();
        
        const t = this.state.currentTopic;
        let duration = task.data.topics[t].taskType === "practice" ? 17: constants.taskDuration;
        const timer = (
            <div style={{marginTop: '10px', textAlign: 'center'}}>
                <Timer start={this.state.start} duration={duration} onFinish={this.onFinish} style={{fontSize: '2em'}} showRemaining={true}/>
            </div>
        );
        const statusbar = (<div style={{marginTop: '10px', textAlign: 'center'}}><StatusBar/></div>)


        let taskbar = <TaskBar taskDescription={getTaskDescription(task.data.topics[t].taskType)}></TaskBar>
        return (
            <TaskedSession timer={timer} taskbar={taskbar} statusbar={statusbar} lastSession={false} firstSession={true}/>
        )
    }

    ////

    onFinish() {
        log(LoggerEventTypes.SESSION_END, {});
        if (this.state.currentTopic === 0) {
            localStorage.setItem("current-topic", this.state.currentTopic+1);
            localStorage.setItem("current-path", '/ecomm/description');
            this.props.history.replace({
                pathname: '/ecomm/description'
            });
        } else {
            localStorage.setItem("current-path", '/ecomm/posttest');
            this.props.history.replace({
                pathname: '/ecomm/posttest'
            });
        }
    }
}

function getIntroSteps() {

    let navigation =  config.interface.navigation;
    if (AccountStore.getTaskData().interface) {
        navigation = AccountStore.getTaskData().interface.navigation;
    } 


    let sharedMessage = navigation === "shared" ? "For each search that you or any of your group members search, our system will automatically load the search results to everyone." : "";

    return [
            {
                title: "Welcome!",
                intro: 'We want you to use our search system, SearchX.',
                position: 'middle'
            },
            {
                element: '.SearchHeader .form',
                intro: 'Use SearchX to search for online products. We have five departments in this online store.'
            },
            {
                element: '.SearchHeader .StatusBarDiv',
                intro: 'You can see your group here with color-based icons. If you hover over it, you can see the information about each member.'
            },
            {
                element: '.QueryHistory',
                intro: 'Recent queries shows your and your group\'s past search queries. In this manner you can see what the other group members are doing. Groups vary in size, so you may see many queries by others, or none at all.',
                position: 'left'
            },
            {
                element: '.SearchResultsContainer',
                intro: 'The search results for your searches will appear here.',
                position: 'right'
            },
            {
                element: '.SearchResultsContainer',
                intro: 'Use the Save icon (heart) on the bottom to save a useful product. Use the cart icon to put products in the shopping cart.',
                position: 'right'
            },
            {
                element: '.Bookmarks',
                intro: 'The products you and your group save will appear here. You can revisit a saved result by clicking on it.',
                position: 'left'
            },
            {
                element: '.Basket',
                intro: 'The products you and your group put in the shopping cart will appear here.',
                position: 'left'
            },
            {
                
                intro: 'Use the chat to discuss with your group about the task at hand. Do not use it for daily conversations.',
                position: 'bottom'
            },

            {
                title: "Your task description",
                intro:  " The goal of this task is to familiarize yourself with our search system.  In contrast to a standard web search engine (like Google, Bing, Duckduckgo, etc.), our search system allows you to search collaboratively. This means that besides search as you know it, you can also “see” what the members of your group are searching for. " + sharedMessage,
                position: 'left'
            },

            {
                title: "Your task description",
                intro:  "In order to learn in a practical way how our system works, we first have a training task for you and your group members. It should be completed within 15 minutes. Here it is:",
                position: 'left'
            },

            {
                title: "Your task description",
                intro:  "<p>This task should be completed within 15 minutes. Here it is:</p> <p>Imagine that your university wants you and your group members to find a product that can help you study from home. " + 
                "You and your group members need to find one product that the university will send to all of the students at the university. " + 
                "You should make sure that this product should be useful to all of the students at the university. " + 
                "For instance, a purple chair is not a good choice, as this colour could annoy some students. " + 
                "To help you out, in a survey conducted by the university last month, some students complained that concentrating during online lectures is very difficult because of noise in their student houses.  " + 
                "The university budget for each product is $100,00. One person of the group should put the final item your group decided to buy from the saved items list into the <em>Shopping Basket</em> widget.</p>",
                position: 'left'
            },


            {
                title: "Your task description",
                intro:  "As this task is a dedicated training task, you are encouraged to try out the various widgets of our search system. " +
                "There is no goal here beyond familiarizing yourself with our search system (and finding a nice product for university students!). " +
                "When the time is up, we will give you another task. " +
                "Finally, please only use our search system to interact with your group members; do not use other tools (like Discord, Whatsapp and so on) to communicate.",
                
                position: 'left'
            },


            {
                element: '.taskDescriptionButton',
                intro:  "You can read the task description again here.",
                position: "left"
            },

    ];
}

export default withRouter(Session);