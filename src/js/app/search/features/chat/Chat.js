import React, {Component} from 'react'
import {Launcher} from 'searchx-chat'

import SessionActions from "../../../../actions/SessionActions";
import ChatStore from "./ChatStore";
import AccountStore from "../../../../stores/AccountStore";

export default class Chat extends Component {

  constructor() {
    super();
    this.state = {
      messageList: [
      ]
    };
    SessionActions.getChatMessageList();
    this.changeHandler = this.changeHandler.bind(this);
  }

  componentWillMount() {ChatStore.addChangeListener(this.changeHandler);}
  componentWillUnmount() {ChatStore.removeChangeListener(this.changeHandler);}

  _onMessageWasSent(message) {
    message.sender = AccountStore.getUserId();
    SessionActions.addChatMessage(message);
  }


  changeHandler() {
    let messageList = ChatStore.getChatMessageList();
    this.setState({
      messageList: messageList
    });
  }


  render() {
    console.log(this.state.messageList);
    return (<div>
      
       <Launcher
        agentProfile={{
          teamName: '',
          imageUrl: '/img/searchx_chat_logo.png'
        }}
        onMessageWasSent={this._onMessageWasSent.bind(this)}
        messageList={this.state.messageList}
        showEmoji
        showFile={false}
      /> 
    </div>)
  }
}