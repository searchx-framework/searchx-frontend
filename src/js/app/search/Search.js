import './Search.pcss';
import React from 'react';

import {log} from '../../utils/Logger';
import {LoggerEventTypes} from '../../utils/LoggerEventTypes';

import AccountStore from "../../stores/AccountStore";
import SearchHeaderContainer from './header/SearchHeaderContainer';
import SearchResultsContainer from "./results/SearchResultsContainer";
import QueryHistoryContainer from "./features/queryhistory/QueryHistoryContainer";
import BookmarksContainer from "./features/bookmarks/BookmarksContainer";
import Chat from "./features/chat/Chat";

export default class Search extends React.Component {
    componentDidMount(){
        sessionStorage.clear();

        document.addEventListener('visibilitychange', function() {
            log(LoggerEventTypes.WINDOW_CHANGE_VISIBILITY, {
                step : "search",
                hidden: document.hidden
            });
        });

        if(AccountStore.isCollaborative()) {
            Chat();
        }
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

    render() {
        return (
            <div className="Search">
                <SearchHeaderContainer/>

                <div className="Content" id="intro-collab-color">
                    <div className="Main">
                        <SearchResultsContainer/>
                    </div>

                    <div className="Side">
                        <QueryHistoryContainer/>
                        <BookmarksContainer/>
                    </div>
                </div>

                <div className="text-center" >
                    <hr/>
                    <p className="Footer">
                        About <a href="/about" target="_blank">SearchX</a>.
                    </p>
                </div>
            </div>
        )
    }
};