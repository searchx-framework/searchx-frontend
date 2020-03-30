import React from "react";
import SyncForm from "../components/form/SyncForm";
import constants from "./constants";
import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";
import Helpers from "../../../utils/Helpers";
import AccountStore from "../../../stores/AccountStore";
import SyncStore from "../../../stores/SyncStore";
import FormContainer from "../components/form/FormContainer";
import Alert from "react-s-alert";
import IntroStore from '../../../stores/IntroStore';

class PreTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timedOut: false,
        };

        this.onComplete = this.onComplete.bind(this);
        this.onSwitchPage = this.onSwitchPage.bind(this);
        this.onLeave = this.onLeave.bind(this);
        this.onTimeout = this.onTimeout.bind(this);
    }

    render() {
        const task = AccountStore.getTaskData();
        if (!task.topics) return <div/>;

        return <div>
            {this.state.timedOut ?
                <FormContainer>
                    <div className='message'>
                        <h2>Sorry, we were not able to find you a partner in time.</h2>
                        <h3>Thank you for taking part in our study.</h3>
                    </div>
                </FormContainer>
                :
                <SyncForm
                    formData={formData(task.topic)}
                    onComplete={this.onComplete}
                    onSwitchPage={this.onSwitchPage}
                    onLeave={this.onLeave}
                    disableCopy={true}
                />
            }
        </div>
    }

    ////

    onComplete(data) {
        log(LoggerEventTypes.SURVEY_INTERMEDIATE_TEST_RESULTS, {
            data: data,
            session: localStorage.getItem("session-num")
        });
        localStorage.setItem("question-data", JSON.stringify(data))
        
        let answers = JSON.parse(localStorage.getItem("question-data"));
        const values = Object.values(answers);
        if (values.includes("1") || values.includes("2")) {
            localStorage.setItem("full-KG-flag", 0)
        } else {
            localStorage.setItem("full-KG-flag", 1)
            localStorage.setItem("flag-sess", localStorage.getItem("session-num"))
        }

        localStorage.setItem("timer-start", Date.now());

        this.props.history.push('/sync/session');
    }

    onSync(data) {

        AccountStore.setGroup(data._id, data.members);
        AccountStore.setTask(data.taskId, data.taskData);
        
        
        IntroStore.clearIntro();
        this.props.history.push('/sync/session');
    }

    onLeave() {
        log(LoggerEventTypes.SURVEY_EXIT, {
            step : "intermediatetest",
            session: localStorage.getItem("session-num"),
            state : this.state
        });
        SyncStore.emitSyncLeave();
        AccountStore.clearUserData();
    }

    onTimeout() {
        log(LoggerEventTypes.SURVEY_GROUPING_TIMEOUT, {
            step : "intermediatetest",
            state: this.state
        });

        SyncStore.emitSyncLeave();
        AccountStore.clearUserData();
    }

    onSwitchPage() {
        let switchTabs = localStorage.getItem("switch-tabs-intermediatetest") || 0;
        switchTabs++;
        localStorage.setItem("switch-tabs-intermediatetest", switchTabs);
        log(LoggerEventTypes.TAB_CHANGE, {
            step: "intermediatetest",
            switch: switchTabs
        });

        if (switchTabs >= constants.switchPageLimit) {
            this.onLeave();
            localStorage.setItem("invalid-user",1);
            this.props.history.push('/disq');
            localStorage.removeItem("switch-tabs-intermediatetest");

            Alert.error('You have been disqualified from the study.', {
                position: 'top-right',
                effect: 'scale',
                beep: true,
                timeout: "none"
            });
        } else {
            Alert.error('We have noticed that you have tried to change to a different window/tab. Please, focus on completing the test.', {
                position: 'top-right',
                effect: 'scale',
                beep: true,
                timeout: "none"
            });

            Alert.warning(`Remember that more than ${constants.switchPageLimit} tab changes result in a disqualification. So far you have changed tabs ${switchTabs} time(s)`, {
                position: 'top-right',
                effect: 'scale',
                beep: true,
                timeout: "none"
            });
        }
    }
}

const formData = function(topic) {
    let pages = [];
    let elements = [];

    let sess= localStorage.getItem("session-num") || 0 ;
    sess++;
    
        elements = [];

        elements.push({
            type: "html",
            name: "topic",
            html:
                `<h2>Test ${sess} </h2>` +
                `<h3>Let's find out what you have learned about the topic from the last search session.</h3>` +
                `<h3>Answer these questions about <b style ="color: #00A6D3;">${topic.title}</b>:</h3>`
        });

        let preAnswer = JSON.parse(localStorage.getItem("question-data"));
        var arr = []
        topic.terms.forEach((term) => {
            const key = `Q-${topic.id}-${term}`;
            if (preAnswer[key]){
                if (preAnswer[key] === 1  || preAnswer[key] === 2){
                    arr.push(term)
                }
            }
        });
        Helpers.shuffle(topic.terms).forEach((term, idx) => {
            if (arr.includes(term) ){ 
            const name = `Q-${topic.id}-${term}`;

            elements.push({
                type: "html",
                html: "<hr/>"
            });

            elements.push({
                title: `How much do you know about "${term}"?`,
                type: "radiogroup",
                isRequired: true,
                name: name,
                choices: constants.choices
            });

            elements.push({
                title: "In your own words, what do you think the meaning is?",
                visibleIf: "{" + name + "} > 2",
                name: "meaning-" + name,
                type: "text",
                inputType: "text",
                width: 500,
                isRequired: true
            });
        }
        });
        pages.push({elements:  elements});
    

    ////

    return {
        pages: pages,
        requiredText: "",
        showProgressBar: "top",
        showQuestionNumbers: "off",
        completedHtml:
        "<h2>Waiting for test to start..</h2>" +
        "<h3>Please do not refresh/exit this page yet.</h3>"
    }
};

export default PreTest;