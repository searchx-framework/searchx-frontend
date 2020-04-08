import React, {Component} from 'react'
import {Launcher} from 'searchx-chat'

import SessionActions from "../../../../actions/SessionActions";
import ChatStore from "./ChatStore";
import AccountStore from "../../../../stores/AccountStore";
import {log} from '../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../utils/LoggerEventTypes';
import config from '../../../../config';

export default class Chat extends Component {

  constructor() {
    super();
    this.state = {
      messageList: [
      ],
      isOpen: false
    };
    SessionActions.getChatMessageList();
    this.changeHandler = this.changeHandler.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }


  

  componentWillMount() {ChatStore.addChangeListener(this.changeHandler);}
  componentWillUnmount() {ChatStore.removeChangeListener(this.changeHandler);
    }


    handleClick() {
      if (this.props.handleClick !== undefined) {
        this.props.handleClick();
      } else {
        this.setState({
          isOpen: !this.state.isOpen,
        });
      }
      let metaInfo = {
        isOpen: this.state.isOpen
      }
      log(LoggerEventTypes.CHAT_CLICK, metaInfo);
    }

  

  _onMessageWasSent(message) {
    message.sender = AccountStore.getUserId();
    message.data.date = new Date();
    let metaInfo = {
      userId: message.sender,
      message: message
    };
    log(LoggerEventTypes.CHAT_MESSAGE, metaInfo);
    SessionActions.addChatMessage(message);
  }


  changeHandler() {
    let messageList = ChatStore.getChatMessageList();
    this.setState({
      messageList: messageList
    });
  }


  render() {
    if (config.interface.chat === false ) {
      return <div/>
    }
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
        isOpen={this.state.isOpen}
        handleClick={this.handleClick}
        onClick={()=> console.log("click")}
      /> 
    </div>)
  }
}