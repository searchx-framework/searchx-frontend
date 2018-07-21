import './SearchHeader.pcss'
import React from 'react';
import config from '../../../../config'
import Helpers from "../../../../utils/Helpers";

const SearchVerticals = function({activeVertical, changeHandler, provider}) {
    const verticalsMap = config.providerVerticals[provider];


    let verticals = "";

    if (!config.interface.verticals) {
         verticals = "";
    } else {
         verticals = Array.from(verticalsMap.keys()).map((vertical, index) => {
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
    }

    return (
        <div className="verticals">
            <ul>
                {verticals}
            </ul>
        </div>
    )
};

export default SearchVerticals;