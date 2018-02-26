import EventEmitter from "events";
import Alert from "react-s-alert";

import {LoggerEventTypes} from "../utils/LoggerEventTypes";
import {log} from "../utils/Logger";

import SearchStore from "../app/search/SearchStore";
import QueryHistoryStore from "../app/search/features/queryhistory/QueryHistoryStore";
import BookmarkStore from "../app/search/features/bookmark/BookmarkStore";

const intro = introJs().setOptions({
    doneLabel:  "Ok!",
    showStepNumbers: false,
    showBullets: false,
    exitOnOverlayClick: false,
    disableInteraction: true,
});

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
        intro.oncomplete(() => {
            localStorage.setItem("intro-done", true.toString());

            SearchStore.removeSearchTutorialData();
            QueryHistoryStore.removeQueryHistoryTutorialData();
            BookmarkStore.removeBookmarksTutorialData();

            callback();
        });

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

export default IntroStore;