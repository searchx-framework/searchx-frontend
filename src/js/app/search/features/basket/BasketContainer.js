import React from 'react';
import Basket from "./components/Basket";

import SessionActions from "../../../../actions/SessionActions";
import SearchStore from "../../SearchStore";
import SessionStore from "../../../../stores/SessionStore";
import BasketStore from "./BasketStore";
import SearchActions from "../../../../actions/SearchActions";
import AccountStore from "../../../../stores/AccountStore";
import Helpers from "../../../../utils/Helpers";
import {log} from "../../../../utils/Logger";
import {LoggerEventTypes} from "../../../../utils/LoggerEventTypes";

function removeHandler(url) {
    log(LoggerEventTypes.BASKET_ACTION, {
        url: url,
        action: "remove"
    });
    SessionActions.removeBasketItem(url);
    SearchStore.modifyMetadata(url, {
        basket: null
    });
}


function clickHandler(url) {
    if (isNaN(url) & Helpers.validURL(url)){
        SearchActions.openUrl(url);
    } else {
        SearchActions.getDocumentById(url);
    }
}

export default class BasketContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            popup: false
        };

        SessionActions.getBasketItems();
        this.changeHandler = this.changeHandler.bind(this);
        this.popupHandler = this.popupHandler.bind(this);
    }

    componentDidMount() {BasketStore.addChangeListener(this.changeHandler);}
    componentWillUnmount() {BasketStore.removeChangeListener(this.changeHandler);}

    render() {

        return <Basket
            items={this.state.items}
            popup={this.state.popup}
            removeHandler={removeHandler}
            clickHandler={clickHandler}
            popupHandler={this.popupHandler}
        />
    }

    ////

    changeHandler() {
        let items = BasketStore.getBasketItems();
        if (!this.props.collaborative) {
            items = items.filter((data) => {
                return data.userId === AccountStore.getUserId();
            })
        }
        items = items.map((data) => {
            data.userColor = SessionStore.getMemberColor(data.userId);
            return data;
        });
        this.setState({
            items: items
        });
    }

    popupHandler() {
        this.setState({
            popup: !this.state.popup
        });
    }
}