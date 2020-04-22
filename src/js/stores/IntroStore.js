import EventEmitter from "events";
import Alert from "react-s-alert";

import {LoggerEventTypes} from "../utils/LoggerEventTypes";
import {log} from "../utils/Logger";

import SearchStore from "../app/search/SearchStore";
import QueryHistoryStore from "../app/search/features/queryhistory/QueryHistoryStore";
import BookmarkStore from "../app/search/features/bookmark/BookmarkStore";
import $ from 'jquery';

/* global introJs */
const intro = introJs().setOptions({
    doneLabel:  "Ok!",
    showStepNumbers: false,
    showBullets: false,
    exitOnOverlayClick: false,
    exitOnEsc: false,
    disableInteraction: true
});

// let intro_done = localStorage.getItem("intro-done") || false.toString();
let state = {
    introDone: localStorage.getItem("intro-done") === 'true'
};

const IntroStore = Object.assign(EventEmitter.prototype, {
    startIntro(steps, callback) {
        if (this.isIntroDone()) {
            callback();
            return;
        }

        log(LoggerEventTypes.SURVEY_INTRO_START, {
            start: Date.now()
        });

        SearchStore.setSearchTutorialData();
        QueryHistoryStore.setQueryHistoryTutorialData();
        BookmarkStore.setBookmarksTutorialData();

        intro.setOption('steps', steps);
        const oncomplete = () => {
            let elapsed = new Date() - localStorage.getItem("timer-start");
            if (elapsed > (3 * 60 * 1000)) {
                localStorage.setItem("invalid-user", true.toString());
            }
            localStorage.setItem("intro-done", true.toString());
            log(LoggerEventTypes.SURVEY_INTRO_END, {
                end: Date.now()
            });
            SearchStore.removeSearchTutorialData();
            QueryHistoryStore.removeQueryHistoryTutorialData();
            BookmarkStore.removeBookmarksTutorialData();

            callback();
        };
        intro.onexit(oncomplete);
        intro.oncomplete(oncomplete);

        intro.onafterchange(function(){
            if (this._introItems.length - 1 === this._currentStep || this._introItems.length === 1) {
                $('.introjs-skipbutton').show();
            }
        });
        
        Alert.closeAll();
        intro.start();

        $('.introjs-skipbutton').hide();
    },

    clearIntro() {
        localStorage.removeItem('intro-done');
        state.introDone = false;
    },

    isIntroDone() {
        let introdone = localStorage.getItem("intro-done") === 'true'
        state.introDone = introdone;
        return state.introDone;
        
    },
});

export default IntroStore;