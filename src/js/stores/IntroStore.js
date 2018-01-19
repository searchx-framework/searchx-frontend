import EventEmitter from "events";
import Alert from "react-s-alert";
import $ from "jquery";

import AccountStore from "./AccountStore";

////

const intro = introJs().setOptions({
    doneLabel:  "Ok!",
    showStepNumbers: false,
    showBullets: false,
    exitOnOverlayClick: false
});

let state = {
    introSearchDone: localStorage.getItem("intro-done-search") === 'true',
    introVideoDone: localStorage.getItem("intro-done-video") === 'true',
};

////

const IntroStore = Object.assign(EventEmitter.prototype, {
    addFinishListener(callback) {
        intro.oncomplete(() => {
            if (AccountStore.getTaskType() === "search") {
                localStorage.setItem("intro-done-search", true.toString());
            } else if(AccountStore.getTaskType() === 'video') {
                localStorage.setItem("intro-done-video", true.toString());
            }

            callback();
        })
    },

    ////

    setupSteps() {
        let steps = stepsTask.concat(stepsSearch);

        if (AccountStore.getTaskType() === 'video') {
            steps = stepsTask.concat(stepsVideo);
        }

        if (AccountStore.isCollaborative()) {
            steps = steps.concat(stepsCollaborative);
        }

        steps = steps.concat(stepsSubmit);
        intro.setOption('steps', steps);
    },

    startIntro() {
        this.setupSteps();
        intro.start();
        Alert.closeAll();
    },

    ////

    isIntroSearchDone() {
        return state.introSearchDone;
    },

    isIntroVideoDone() {
        return state.introVideoDone;
    },

    isIntroDone() {
        let introDone = false;

        if (AccountStore.getTaskType() === "search") {
            introDone = this.isIntroSearchDone();
        }

        if (AccountStore.getTaskType() === "video") {
            introDone = this.isIntroVideoDone();
        }

        return introDone;
    },
});

////

$('.introjs-skipbutton').hide();
intro.onafterchange(function(){
    if (this._introItems.length - 1 === this._currentStep || this._introItems.length === 1) {
        $('.introjs-skipbutton').show();
    }
});

////

const stepsTask = [
    {
        element: '#intro-description',
        intro: 'Please take a minute to read your task description.',
        position: 'top'
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
        intro: 'We want you to use our custom web search system SearchX.',
        position: 'bottom-middle-aligned'
    },
    {
        element: '#intro-search-bar',
        intro: 'Use SearchX to search for webpages, publications, and other online sources about the topic.'
    },
    {
        element: '#intro-query-history',
        intro: 'You can view the query history to help plan your next search queries.',
        position: 'top'
    },
    {
        element: '#intro-search-results',
        intro: 'To save a resource that is useful for your term paper, bookmark it.',
        position: 'top'
    },
    {
        element: '#intro-bookmark-bar',
        intro: 'The bookmarked documents will appear here. You can revisit them before completing the final test.',
        position: 'top'
    }
];

const stepsCollaborative = [
    {
        element: '#intro-collab-color',
        intro: 'The query history and bookmarks will be color coded to show which user initiated the action.',
        position: 'top'
    },
    {
        element: '#intro-collab-chat',
        intro: 'You can use the provided chat window to coordinate with your learning partner',
        position: 'auto'
    }
];

const stepsSubmit = [
    {
        element: '#intro-counter',
        intro: 'You will need to learn for 20 minutes. Afterwards, you can press the button to complete the final test. Good luck and have fun!',
        position: 'bottom'
    }
];

export default IntroStore;