import React from "react";
import Form from "../components/form/Form";
import constants from "./constants";
import Helpers from "../../../utils/Helpers";
import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";
import Alert from "react-s-alert";
import AccountStore from "../../../stores/AccountStore";
import SyncStore from "../../../stores/SyncStore";
import SearchStore from "../../search/SearchStore";
import SearchResultsContainer from "../../search/results/SearchResultsContainer";
import SearchActions from '../../../actions/SearchActions';
import BookmarkContainer from "../../search/features/bookmark/BookmarkContainer";


class PostTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            finished: localStorage.getItem('posttest-finish') === 'true',
            activeDoctext: SearchStore.getActiveDoctext(),
            searchState: SearchStore.getSearchState(),
        progress: SearchStore.getSearchProgress(),
        serpId: SearchStore.getSerpId(),
        activeUrl: SearchStore.getActiveUrl()
        };

        this.onComplete = this.onComplete.bind(this);
        this.onSwitchPage = this.onSwitchPage.bind(this);
        this.onLeave = this.onLeave.bind(this);
    }
    documentCloseHandler() {
        SearchActions.closeUrl();
    }

    render() {
        const task = AccountStore.getTask();
        window.globalPage=1;
        function keepMePosted(){
            var els = document.getElementsByClassName('btn-green');
            var hideme = document.getElementById("hideme");
            Array.prototype.forEach.call(els, function(el) {
                if (el.value === "Next" || el.value === "Previous") {
                    el.onclick=function(){
                        window.globalPage=window.globalPage===1?2:1;		
                    }
            }
            });
            if (hideme!=null){
                if (window.globalPage===1){
                    hideme.style.display="none";
                } else {
                    hideme.style.display="block";
                }
            }
            setTimeout(keepMePosted, 200);
        }
        setTimeout(keepMePosted, 2000);
        
        localStorage.setItem("post-test", 1);
        return (
        <div className="Form">
        <Form
            formData={formData(task.data.topic)}
            formValidation={formValidation}
            onSwitchPage={this.onSwitchPage}
            onComplete={this.onComplete}
            onLeave={this.onLeave}
            disableCopy={true}
        />
                        <div className="SearchResultsContainer">
                            <SearchResultsContainer/>
                        </div>
        <div className="Side" id="hideme">
        <BookmarkContainer collaborative={this.props.collaborative}/>
        </div> 
        </div>
        )
    }

    ////

    onComplete(data) {
        log(LoggerEventTypes.SURVEY_POST_TEST_RESULTS, {
            data: data
        });

        localStorage.setItem('posttest-finish', true.toString());
        this.setState({ finished :true});
    }
    onLeave() {
        log(LoggerEventTypes.SURVEY_EXIT, {
            step : "postest",
            state : this.state
        });

        SyncStore.emitSyncLeave();
        AccountStore.clearUserData();
    }
    onSwitchPage() {
        let switchTabs = localStorage.getItem("switch-tabs-pretest") || 0;
        switchTabs++;
        localStorage.setItem("switch-tabs-pretest", switchTabs);
        log(LoggerEventTypes.TAB_CHANGE, {
            step: "postest",
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

const formValidation = function(sender, question) {
    if (question.name === 'summary') {
        const text = question.value;
        const c = text.split(" ").length;

        if (c < 100) {
            question.error = "You have written only " + c + " words, you need to write at least 100 words to complete the exercises.";
        }
    }
};

const formData = function(topic) {
    let pages = [];
    let elements = [];

    ////

    elements.push({
        type: "html",
        name: "topic",
        html: `<h2>Test 5</h2>` +
        `<h3>Let's see how much you've learned.</h3>` +
        `<h3>Answer these questions about <b style ="color: #00A6D3;">${topic.title}</b>:</h3>`
    });

    Helpers.shuffle(topic.terms).forEach((term, idx) => {
        const name = "Q-"+ topic.id +"-"+ term;

        elements.push({
            title: "How much do you know about \"" + term + "\"?",
            type: "radiogroup",
            isRequired: true,
            name: name,
            choices: constants.choices
        });

        elements.push({
            title: "In your own words, what do you think the meaning is?",
            visibleIf: "{" + name + "} > 2",
            name: "meaning-" + idx,
            type: "text",
            inputType: "text",
            width: 500,
            isRequired: true,
        });
    });

    pages.push({elements:  elements});

    ////


    elements = [];

    elements.push({
        type: "html",
        name: "outline-description",
        html: `
            <p>  ${topic.description}</p>
            <b> Based on what you have learned from the search session about the topic, please write, in your own words, a summary at a minimum of 100 words. </b>
            
            `
    });

    // elements.push({
    //     title: "Write your outline here:",
    //     name: "outline-paper",
    //     type: "comment",
    //     inputType: "text",
    //     description: "",
    //     rows: 6,
    //     isRequired: true
    // });

    elements.push({
        title: "Please write your summary here. ",
        name: "summary",
        type: "comment",
        inputType: "text",
        rows: 6,
        isRequired: true
    });

    elements.push({
        type: "html",
        name: "searchx-feedback-description",
        html: "<b>We would also like you to describe your experience while using SearchX and taking part in our study. This information will help us in making SearchX better for future usage. It will also help us to analyze user experience during the study. </b>"
    });
   

    // elements.push({
    //     title: "During your searches did you have difficulties finding information about something? If so, describe briefly what you were looking for.",
    //     name: "difficulties",
    //     type: "comment",
    //     inputType: "text",
    //     rows: 4,
    //     isRequired: true
    // });
    elements.push({
        title: "I didn't notice any inconsistencies when I used the system.",
        name: "inconsistencies",
        type: "rating",
        isRequired: true,
        minRateDescription: "Disagree",
        maxRateDescription: "Agree"
    });


    elements.push({
        title: "It was easy to determine if a document was relevant to a task.",
        name: "relevance",
        type: "rating",
        isRequired: true,
        minRateDescription: "Disagree",
        maxRateDescription: "Agree"
    });


    elements.push({
        title: "How difficult was this task?",
        name: "difficult",
        type: "rating",
        isRequired: true,
        minRateDescription: "Very easy",
        maxRateDescription: "Very difficult"
    });

    elements.push({
        title: "Do you have any additional comments regarding SearchX?",
        name: "additional-comment",
        type: "comment",
        inputType: "text",
        rows: 4,
        isRequired: true
    });

    pages.push({elements:  elements});

    ////

    return {
        pages: pages,
        requiredText: "",
        showProgressBar: "top",
        showQuestionNumbers: "off",
        completedHtml: "<h2>Thank you for taking part in our study.</h2> <h3>Follow this <a href=" + constants.completionURL + "> link</a> back to Prolific Academic to confirm your participation.</h3>" ,
    }
};

export default PostTest;