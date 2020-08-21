import React from 'react';
////

const TextViewer = function ({result}) {
    
    var doctext = result.text.split('\n').map((item, key) => {
        return <span key={key}>{item}<br/></span>
    })

    doctext.unshift(<h4> {result.source} <br/></h4>);
    doctext.unshift(<h3> {result.name} <br/></h3>);


    return doctext;
};

export default TextViewer;