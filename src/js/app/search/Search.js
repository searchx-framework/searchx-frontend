import './Search.pcss';
import React from 'react';

import {log} from '../../utils/Logger';
import {LoggerEventTypes} from '../../utils/LoggerEventTypes';

import SearchHeaderContainer from './header/SearchHeaderContainer';
import SearchResultsContainer from "./results/SearchResultsContainer";
import QueryHistoryContainer from "./features/queryhistory/QueryHistoryContainer";
import BookmarkContainer from "./features/bookmark/BookmarkContainer";
import Chat from "./features/chat/Chat";
import config from "../../config";

import Collapsible from 'react-collapsible';

class Search extends React.Component {
    componentDidMount(){
        sessionStorage.clear();

        if (config.interface.chat && this.props.collaborative) {
            Chat();
        }
    }

    componentWillUnmount() {
        if (config.interface.chat && this.props.collaborative) {
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
                        <QueryHistoryContainer collaborative={this.props.collaborative}/>
                        <BookmarkContainer collaborative={this.props.collaborative}/>
                    </div>


      <Collapsible trigger="Your task" transitionTime={3}>
      
            <p> Imagine you are a reporter for a newspaper. Your editor has just asked you and your colleague[s] to gather documents
                from a collection of news articles to write a story about [provided topic title]. </p>
                <br/>
            <p> There's a meeting in an hour, so your editor asks you and your colleague[s] to spend 10 minutes together and search 
                for and save as many useful documents as possible.  </p>

        <p> To guarantee the quality of the documents, your editor, who will look over the collected resources in the end, 
            requests that you use a collaborative search system (SearchX). </p>

        <p> Collect documents according to the following criteria: </p>

        <p> [topic narrative] </p>

      </Collapsible>
                </div>

      
            </div>
        )
    }
}

Search.defaultProps = {
    collaborative: true
};

export default Search;