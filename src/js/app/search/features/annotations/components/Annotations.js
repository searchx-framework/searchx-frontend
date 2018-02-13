import './Annotations.pcss';
import React from 'react';

import AnnotationsForm from "./AnnotationsForm";
import AnnotationsItem from "./AnnotationsItem";

const Annotations = function({annotations, submitHandler, removeHandler, userId}) {
    const list = annotations.map((data, index) => {
        return <AnnotationsItem
            key={index} index={index}
            data={data}
            removeHandler={removeHandler}
            userId={userId}
        />
    });

    return (
        <div className="Annotations">
            <AnnotationsForm onSubmit={submitHandler}/>
            <div className="list">
                {list}
            </div>
        </div>
    );
};

export default Annotations;