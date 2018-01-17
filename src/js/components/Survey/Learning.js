import './Survey.css'
import React from 'react';
import Alert from 'react-s-alert';

import Search from "../Search/Search";
import Video from "../Video/Video";
import Task from "./Task/Task";

import {log} from '../../utils/Logger';
import {LoggerEventTypes} from '../../utils/LoggerEventTypes';
import $ from 'jquery';

import AccountStore from "../../stores/AccountStore";
import TaskStore from "../../stores/TaskStore";

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
        intro: 'You can view your query history to help reformulate your search queries.',
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

const stepsSubmit = [
    {
        element: '#intro-counter',
        intro: 'You will need to learn for 20 minutes. Afterwards, you can press the button to complete the final test. Good luck and have fun!',
        position: 'bottom'
    }
];

////

const initializeChat = function() {
    const chatRoom = 'searchx-' + AccountStore.getSessionId() + '@conference.nomnom.im';

    converse.initialize({
        authentication: 'anonymous',
        auto_login: true,
        auto_reconnect: true,

        allow_logout: false,
        allow_muc_invitations: false,
        allow_contact_requests: false,
        allow_bookmarks: false,
        allow_registration: false,
        allow_muc: false,

        auto_join_rooms: [chatRoom],
        notify_all_room_messages: [chatRoom],
        bosh_service_url: 'https://conversejs.org/http-bind/', //TODO: change to own server
        jid: 'nomnom.im',

        keepalive: true,
        hide_muc_server: true,
        play_sounds: true,
        synchronize_availability: false,
        show_controlbox_by_default: false,
        show_desktop_notifications: false,
        strict_plugin_dependencies: false,

        visible_toolbar_buttons: {
            call: false,
            clear: false,
            toggle_occupants: false,
            emoji: true
        },

        blacklisted_plugins: [
            'converse-dragresize',
            'converse-vcard',
            'converse-notification',
            'converse-register',
            'converse-bookmarks'
        ],

        whitelisted_plugins: [
            'searchx-archive'
        ]
    });
};

////

class Learning extends React.Component {

    constructor() {
        super();
        this.state = {
            task: AccountStore.getTask()
        };

        ////

        this.intro = introJs().setOptions({
            doneLabel:  "Ok!",
            showStepNumbers: false,
            showBullets: false,
            exitOnOverlayClick: false
        });

        $('.introjs-skipbutton').hide();
        this.intro.onafterchange(function(){
            if (this._introItems.length - 1 === this._currentStep || this._introItems.length === 1) {
                $('.introjs-skipbutton').show();
            }
        });

        this.isIntroDone = this.isIntroDone.bind(this);
        this.handleOnIntroDone = this.handleOnIntroDone.bind(this);
        this.handleOnBackButtonEvent = this.handleOnBackButtonEvent.bind(this);
        this.intro.oncomplete(this.handleOnIntroDone);
    }

    ////

    handleOnIntroDone () {
        const start = localStorage.getItem("counter-start") || Date.now();
        localStorage.setItem("counter-start", start);

        if (this.state.task.type === "video") {
            localStorage.setItem("intro-done-video", true);
        } else if (this.state.task.type === "search") {
            localStorage.setItem("intro-done-search", true);
        }

        ////

        const metaInfo = {
            start: start,
            step: this.state.task.type
        };
        log(LoggerEventTypes.SURVEY_LEARNING_START, metaInfo);

        window.location.reload(true);
    }

    handleOnBackButtonEvent (e) {
       e.preventDefault();
       this.props.history.go();
    }

    isIntroDone() {
        let introDone = false;

        if (this.state.task.type === "video") {
            introDone = TaskStore.isIntroVideoDone();
        }

        if (this.state.task.type === "search") {
            introDone = TaskStore.isIntroSearchDone();
        }

        return introDone;
    };

    ////

    componentWillMount() {
        const task = AccountStore.getTask();

        let steps = stepsTask.concat(stepsSearch, stepsSubmit);
        let medium = <Search/>;

        if (task.type === 'video') {
            steps = stepsTask.concat(stepsVideo, stepsSubmit);
            medium = <Video/>;
        }

        if (task.type === 'both') {
            steps = stepsTask.concat(stepsVideo, stepsSubmit);
            medium =
                <div>
                    <Video/>
                    <hr/>
                    <Search/>
                </div>;
        }

        this.state.task = task;
        this.state.medium = medium;
        this.state.steps = steps;
    }

    componentDidMount() {
        if (this.state.task.topic !== '') {
            if (!this.isIntroDone()) {
                this.intro.setOption('steps', this.state.steps);
                this.intro.start();
                Alert.closeAll();

            } else {
                if (AccountStore.isCollaborative()) {
                    initializeChat();
                }
            }
        }

        window.onpopstate = this.handleOnBackButtonEvent;
    }

    componentWillUnmount() {
        if (AccountStore.isCollaborative()) {
            const messages = document.querySelector(".chat-content").innerHTML;
            const metaInfo = {
                messages: messages
            };
            log(LoggerEventTypes.CHAT_ARCHIVE, metaInfo);

            const element = document.querySelector("#conversejs");
            element.parentElement.removeChild(element);
        }
    }

    ////

    render() {
        if (this.state.task.topic === '' || TaskStore.isOverSwitchTabsLimit()) {
            return (
                <div/>
            );
        }

        ////

        let style = {};
        if (!this.isIntroDone()) {
            style.position = 'relative'
        }

        return(
            <div className="Learning row">
                <div className="Learning-medium col-md-9 col-sm-12 col-xs-12">
                    {this.state.medium}
                </div>

                <div className="Learning-task col-md-3 col-sm-12 col-xs-12" style={style}>
                    <Task task={this.state.task}/>
                </div>
            </div>
        );
    }
}

export default Learning;
