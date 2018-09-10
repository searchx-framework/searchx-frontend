import './Suggestion.pcss';
import React from 'react';
import AspectItem from "./AspectItem";

const Aspects = function({aspects, clickHandler}) {
    const list = aspects.map((data, index) => {
        return <AspectItem
            key={index}
            data={data}
            clickHandler={clickHandler}
        />
    });

    return (
        <div className="Aspects">
            {list}
        </div>
    )
};

export default Aspects;