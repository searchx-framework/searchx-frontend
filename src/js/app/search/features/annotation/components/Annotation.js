import './Annotation.pcss';
import React from 'react';

import AnnotationsForm from "./AnnotationForm";
import AnnotationsItem from "./AnnotationItem";

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
                {list.reverse()}
            </div>
        </div>
    );
};

export default Annotations;