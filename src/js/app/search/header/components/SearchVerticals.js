import './SearchHeader.pcss'
import React from 'react';
import config from '../../../../config'
import Helpers from "../../../../utils/Helpers";
import SearchStore from "../../SearchStore";

const SearchVerticals = function({activeVertical, changeHandler, provider}) {
    // Hack to work around the fact that the verticalsList may not initially be available,
    // because it still needs to be fetched from the backend. Once it is retrieved, a change
    // event will be emitted causing this component to update with the correct verticalsList.
    let verticalsList;
    if (SearchStore.getProviderVerticals()) {
        verticalsList = SearchStore.getProviderVerticals()[provider];
    } else {
        verticalsList = [];
    }

    let verticals = verticalsList.map((vertical, index) => {
        let cn = 'search-vertical item';
        if (vertical === activeVertical) {
            cn += ' active';
        }

        return (
            <li key={index} className={cn} onClick={() => changeHandler(vertical)}>
                {Helpers.capitalizeFirstLetter(vertical)}
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