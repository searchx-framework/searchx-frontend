import './SearchHeader.pcss'
import React from 'react';

const SearchVerticals = function({activeVertical, changeHandler}) {
    const verticalsList = ['Web', 'Images', 'Videos','News'];

    let verticals = verticalsList.map((vertical, index) => {
        let cn = 'item';
        if (vertical.toLocaleLowerCase() === activeVertical) {
            cn += ' active';
        }

        return (
            <li key={index} className={cn} onClick={() => changeHandler(vertical)}>
                {vertical}
            </li>
        )
    });

    return (
        <div className="verticals">
            <ul>
                {verticals}
            </ul>
        </div>
    )
};

export default SearchVerticals;