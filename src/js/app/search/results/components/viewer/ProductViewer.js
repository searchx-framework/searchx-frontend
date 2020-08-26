import React from 'react';
////

import ReactStars from 'react-stars'
import ShowMoreText from 'react-show-more-text';

const getStars = function(stars) {
    return <ReactStars
    count={5} value={stars} edit={false} half={true}
size={18}
color2={'#ffd700'} /> 
}
const ProductViewer = function (result) {
    var doctext = [<h3> {result.name} by {result.brand} <br/></h3>];
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
    doctext.push(<div className="productDescription">
        
        <ShowMoreText
                /* Default options */
                lines={3}
                more='Show more'
                less='Show less'
                anchorClass=''
                expanded={false}
                width={600}
            >
        {result.description}</ShowMoreText></div>)
    
    if (result.reviews.length > 0) {
        doctext.push(<br/>)
        doctext.push(<h6> Product Customer Reviews </h6> )
       let reviews = result.reviews.map((item, key) => {
        return <div className="productReview" key={key}>
            <hr/>
            <p>{item.summary}</p>
            <p>Overall Rating:</p> {getStars(item.overall)}
            <br/>
            <p> {item.reviewText}</p>
        </div>
        })
        doctext.push(reviews)
    }

    return doctext;
};

export default ProductViewer;