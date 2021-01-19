import React from "react";
import SyncForm from "../components/form/SyncForm";
import constants from "./constants";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";

import AccountStore from "../../../stores/AccountStore";
import SyncStore from "../../../stores/SyncStore";
import SessionStore from "../../../stores/SessionStore";
import FormContainer from "../components/form/FormContainer";
import Alert from "react-s-alert";
import Helpers from '../../../utils/Helpers';
import IntroStore from '../../../stores/IntroStore';

class PreTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timedOut: false,
        };

        this.onComplete = this.onComplete.bind(this);
        this.onSwitchPage = this.onSwitchPage.bind(this);
        this.onSync = this.onSync.bind(this);
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
                    formData={formData(task.topics)}
                    onComplete={this.onComplete}
                    onSwitchPage={this.onSwitchPage}
                    onSync={this.onSync}
                    onLeave={this.onLeave}
                    disableCopy={true}
                />
            }
        </div>
    }

    ////

    onComplete(data) {
        log(LoggerEventTypes.SURVEY_PRE_TEST_RESULTS, {
            data: data
        });
        localStorage.setItem("question-data", JSON.stringify(data))
        SyncStore.emitSyncSubmit(data);
        Helpers.sleep(constants.waitDuration * 60 * 1000).then(() => {
            this.setState({timedOut: true}, () => {
                this.onLeave();
            });
        });

        SessionStore.updateTask(constants.taskId, data, (res) => {
            if (res) {
                if ('topic' in res.taskData) {
                    this.props.history.push('/sync/session');
                } 
            }
        });
    }

    onSync(data) {

        AccountStore.setGroup(data._id, data.members);
        AccountStore.setTask(data.taskId, data.taskData);
        
        
        IntroStore.clearIntro();
        this.props.history.push('/sync/session');
    }

    onLeave() {
        log(LoggerEventTypes.SURVEY_EXIT, {
            step : "pretest",
            state : this.state
        });
        
        SyncStore.emitSyncLeave();
        AccountStore.clearUserData();
    }

    onTimeout() {
        log(LoggerEventTypes.SURVEY_GROUPING_TIMEOUT, {
            step : "pretest",
            state: this.state
        });

        SyncStore.emitSyncLeave();
        AccountStore.clearUserData();
    }

    onSwitchPage() {

        let switchTabs = localStorage.getItem("switch-tabs-pretest") || 0;
        switchTabs++;
        localStorage.setItem("switch-tabs-pretest", switchTabs);
        log(LoggerEventTypes.TAB_CHANGE, {
            step: "pretest",
            switch: switchTabs
        });

        if (switchTabs >= constants.switchPageLimit) {
            this.onLeave();
            localStorage.setItem("invalid-user",1);
            this.props.history.push('/disq');
            localStorage.removeItem("switch-tabs-pretest");
            

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

const formData = function(topics) {
    let pages = [];
    let elements = [];

    topics.forEach(topic => {
        elements = [];

        elements.push({
            type: "html",
            name: "topic",
            html:
                `<h2>Test 1</h2>` +
                `<h3>Let's find out what you already know first.</h3>` +
                `<h3>Answer these questions about <b style ="color: #00A6D3;">${topic.title}</b>:</h3>`
        });

        topic.terms.forEach((term, idx) => {
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
        });

        pages.push({elements:  elements});
    });

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