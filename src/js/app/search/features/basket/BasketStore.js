import request from 'superagent';
import EventEmitter from 'events'

import {register} from '../../../../utils/Dispatcher';
import ActionTypes from '../../../../actions/ActionTypes';

import AccountStore from '../../../../stores/AccountStore';
import SyncStore from '../../../../stores/SyncStore';
import SearchStore from "../../SearchStore";
import AnnotationStore from "../annotation/AnnotationStore";
import RatingStore from "../rating/RatingStore.js";

const CHANGE_EVENT = 'change_basket';

const state = {
    basket: [],
    tutorial: false
};

const BasketStore = Object.assign(EventEmitter.prototype, {
    emitChange() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    getBasketItems() {
        if (state.tutorial) {
            return [
                {title: "You can view your basket items here", url: "https://www.viewbasket.com", userId: "1"},
                {title: "You also can delete any basket items here", url: "https://www.deletebasket.com", userId: "1"},
            ];
        }

        const starred = state.basket.filter(x => x.starred);
        const notStarred = state.basket.filter(x => !x.starred);
        return starred.concat(notStarred);
    },

    setBasketTutorialData() {
        state.tutorial = true;
        this.emitChange();
    },
    removeBasketTutorialData() {
        state.tutorial = false;
        this.emitChange();
    },

    dispatcherIndex: register(action => {
        switch(action.type) {
            case ActionTypes.GET_BASKET_ITEMS:
                _get('basket');
                break;
            case ActionTypes.ADD_BASKET_ITEM:
                _add(action.payload.url, action.payload.title, 'basket');
                break;
            case ActionTypes.REMOVE_BASKET_ITEM:
                _remove(action.payload.url, 'basket');
                break;
            default:
                break;
        }
    })
});

////

const _get = function(type) {
    request
        .get(`${process.env.REACT_APP_SERVER_URL}/v1/session/${AccountStore.getSessionId()}/${type}`)
        .end((err, res) => {
            if (err || !res.body || res.body.error) {
            } else {
                state[type] = res.body.results;
                res.body.results.forEach(result => {
                    const resultId = result.url ? result.url : result.id;
                    if (!AnnotationStore.getUrlAnnotations(resultId)) {
                        AnnotationStore._get_annotations(resultId);
                    }
                    if (!RatingStore.getUrlRating(resultId)) {
                        RatingStore._get_rating(resultId);
                    }
                })  
            }
            BasketStore.emitChange();
            SearchStore.updateMetadata();
        });
};

const _add = function(url, title, type) {
    const userId = AccountStore.getUserId();
    request
        .post(`${process.env.REACT_APP_SERVER_URL}/v1/session/${AccountStore.getSessionId()}/${type}`)
        .send({
            userId: userId,
            url: url,
            title: title
        })
        .end(() => {
            _broadcast_change();
        });

    state[type].push({
        url: url,
        title: title,
        userId: userId,
        date: new Date()
    });
    BasketStore.emitChange();
    SearchStore.updateMetadata();
};

const _remove = function(url, type) {
    request
        .delete(`${process.env.REACT_APP_SERVER_URL}/v1/session/${AccountStore.getSessionId()}/${type}`)
        .send({
            url: url
        })
        .end(() => {
            _broadcast_change();
        });

    state[type] = state[type].filter((item) => item.url !== url);
    BasketStore.emitChange();
    SearchStore.updateMetadata();
};



const _broadcast_change = function() {
    SyncStore.emitBasketUpdate(SearchStore.getSearchState());
};

////

export default BasketStore;
