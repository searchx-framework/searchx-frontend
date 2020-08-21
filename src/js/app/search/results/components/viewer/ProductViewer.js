import React from 'react';
////

import ReactStars from 'react-stars'

const getStars = function(stars) {
    return <ReactStars
    count={5} value={stars} edit={false} half={true}
size={18}
color2={'#ffd700'} /> 
}
const ProductViewer = function (result) {
    var doctext = [<h3> {result.name} <br/></h3>];
    doctext.push(<img className="imageViewer" 
    src={result.image} alt={result.name} ></img>)
    doctext.push( 
    <div className="infoPrice">
    <div className="row" > 
    <ReactStars
         count={5} value={result.rating} edit={false} half={true}

    size={18}
    color2={'#ffd700'} />  ({result.count})
    </div>
    <div className="row">
    <span className="price">${result.price}</span>
    </div></div>)
    
    doctext.push(<h6> Product Description </h6>)
    doctext.push(<hr/>)
    doctext.push(<div className="productDescription">{result.description}</div>)
    
    if (result.reviews.length > 0) {
        doctext.push(<h6> Product Customer Reviews </h6> )
        doctext.push(<hr/>)
       let reviews = result.reviews.map((item, key) => {
        return <div className="productReview" key={key}>
            <p>{item.summary}</p>
            <p>Overall Rating: {getStars(item.overall)}</p>
            <br/>
            <p> {item.reviewText}</p>
            <hr/>
        </div>
        })
        doctext.push(reviews)
    }

    return doctext;
};

export default ProductViewer;