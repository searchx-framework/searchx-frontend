import './Survey.css'
import React from 'react';

import Search from "../Search/Search";
import Video from "../Video/Video";
import Task from "./Task/Task";

import {log} from '../../utils/Logger';
import {LoggerEventTypes} from '../../utils/LoggerEventTypes';

import AccountStore from "../../stores/AccountStore";
import TaskStore from "../../stores/TaskStore";
import IntroStore from "../../stores/IntroStore";

////

class Learning extends React.Component {

    constructor() {
        super();
        this.state = {
            task: AccountStore.getTask()
        };

        ////

        this.handleOnIntroDone = this.handleOnIntroDone.bind(this);
        this.handleOnBackButtonEvent = this.handleOnBackButtonEvent.bind(this);

        IntroStore.addFinishListener(this.handleOnIntroDone);
    }

    ////

    handleOnIntroDone () {
        const start = localStorage.getItem("counter-start") || Date.now();
        localStorage.setItem("counter-start", start);

        ////

        log(LoggerEventTypes.SURVEY_LEARNING_START, {
            start: start,
            step: this.state.task.type
        });

        window.location.reload(true);
    }

    handleOnBackButtonEvent (e) {
       e.preventDefault();
       this.props.history.go();
    }

    ////

    componentWillMount() {
        const task = AccountStore.getTask();
        let medium = <Search/>;

        if (task.type === 'video') {
            medium = <Video/>;
        }

        if (task.type === 'both') {
            medium =
                <div>
                    <Video/>
                    <hr/>
                    <Search/>
                </div>;
        }

        this.state.task = task;
        this.state.medium = medium;
    }

    componentDidMount() {
        if (this.state.task.topic !== '') {
            if (!IntroStore.isIntroDone()) {
                IntroStore.startIntro();
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
            log(LoggerEventTypes.CHAT_ARCHIVE, {
                messages: messages
            });

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
        if (!IntroStore.isIntroDone()) {
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

export default Learning;
