import './Basket.pcss';
import React from 'react';
import BasketItem from './BasketItem';
import BasketWindow from "./BasketWindow";

const Basket = function({items, popup, removeHandler, clickHandler, popupHandler}) {
    const list = items.map((data, index) => {
        return <BasketItem
            key={index}
            data={data}
            removeHandler={removeHandler}
            clickHandler={clickHandler}
        />
    });

    return (
        <div className="Basket">
            <h3 className="banner" onClick={popupHandler}>
                <i className="fa fa-shopping-cart medium"/> Shopping basket
            </h3>

            <div className="list">
                {list}
            </div>

            <BasketWindow
                active={popup}
                list={list}
                closeHandler={popupHandler}
            />
        </div>
    )
};

export default Basket;