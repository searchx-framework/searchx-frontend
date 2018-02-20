import EventEmitter from "events";
import Alert from "react-s-alert";
import $ from "jquery";

import {LoggerEventTypes} from "../utils/LoggerEventTypes";
import {log} from "../utils/Logger";

import AccountStore from "./AccountStore";
import SearchStore from "../app/search/SearchStore";
import QueryHistoryStore from "../app/search/features/queryhistory/QueryHistoryStore";
import BookmarkStore from "../app/search/features/bookmark/BookmarkStore";

////

const intro = introJs().setOptions({
    doneLabel:  "Ok!",
    showStepNumbers: false,
    showBullets: false,
    exitOnOverlayClick: false,
    disableInteraction: true,
});

$('.introjs-skipbutton').hide();
intro.onafterchange(function(){
    if (this._introItems.length - 1 === this._currentStep || this._introItems.length === 1) {
        $('.introjs-skipbutton').show();
    }
});

let state = {
    introDone: localStorage.getItem("intro-done") === 'true'
};

////

const IntroStore = Object.assign(EventEmitter.prototype, {
    addFinishListener(callback) {
        intro.oncomplete(() => {
            localStorage.setItem("intro-done", true.toString());

            SearchStore.removeSearchTutorialData();
            QueryHistoryStore.removeQueryHistoryTutorialData();
            BookmarkStore.removeBookmarksTutorialData();

            callback();
        })
    },

    ////

    startIntro() {
        log(LoggerEventTypes.SURVEY_INTRO_START, {
            start: Date.now()
        });

        SearchStore.setSearchTutorialData();
        QueryHistoryStore.setQueryHistoryTutorialData();
        BookmarkStore.setBookmarksTutorialData();

        setupSteps();
        Alert.closeAll();
        intro.start();
    },

    clearIntro() {
        localStorage.removeItem('intro-done');
        state.introDone = false;
    },

    isIntroDone() {
        return state.introDone;
    },
});

////

function setupSteps() {
    let steps = stepsTask.concat(stepsSearch);

    if (AccountStore.isCollaborative()) {
        steps = stepsTask.concat(stepsSearchCollaborative);
    }

    steps = steps.concat(stepsSubmit);
    intro.setOption('steps', steps);
}

const stepsTask = [
    {
        element: '#intro-description',
        intro: 'Please take a minute to read your task description.',
        position: 'top'
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
        element: '#intro-bookmarks-bar',
        intro: 'The bookmarked documents will appear here. You can revisit them before completing the final test.',
        position: 'top'
    }
];

const stepsSearchCollaborative = [
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
        intro: 'The query history shows your and your group\'s past search queries. In this manner you see what the others are doing.',
        position: 'top'
    },
    {
        element: '#intro-search-results',
        intro: 'To save a resource that is useful, bookmark it. You also see your group\'s bookmarks here.',
        position: 'top'
    },
    {
        element: '#intro-bookmarks-bar',
        intro: 'The documents you and your group bookmarked will appear here. You can revisit them before completing the session.',
        position: 'top'
    },
    {
        element: '#intro-collab-color',
        intro: 'The query history and bookmarks are color-coded to show who initiated the action.',
        position: 'top'
    },
    {
        element: '#intro-collab-chat',
        intro: 'Please use the provided chat window to collaborate with your group during the session.',
        position: 'auto'
    }
];

const stepsSubmit = [];

export default IntroStore;