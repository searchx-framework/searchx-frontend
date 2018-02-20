import './Annotation.pcss';
import React from 'react';

import AnnotationForm from "./AnnotationForm";
import AnnotationItem from "./AnnotationItem";

const Annotations = function({annotations, submitHandler, removeHandler, userId}) {
    const list = annotations.map((data, index) => {
        return <AnnotationItem
            key={index} index={index}
            data={data}
            removeHandler={removeHandler}
            userId={userId}
        />
    });

    return (
        <div className="Annotations">
            <AnnotationForm onSubmit={submitHandler}/>
            <div className="list">
                {list.reverse()}
            </div>
        </div>
    );
};

export default Annotations;