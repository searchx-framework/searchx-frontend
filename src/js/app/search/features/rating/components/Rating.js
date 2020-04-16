import './Rating.pcss';
import React from 'react';
import ReactRating from 'react-rating';

const Rating = function({rating, total, submitHandler}) {
    return (
        <span className="Rating">
            <span className="count">{total}</span>

            <ReactRating className="button up" emptySymbol="fa fa-thumbs-o-up" fullSymbol="fa fa-thumbs-up"
                    onClick={() => submitHandler(1)}
                    stop={1} initialRate={rating === 1 ? 1 : 0}
            />

            <ReactRating className="button down" emptySymbol="fa fa-thumbs-o-down" fullSymbol="fa fa-thumbs-down"
                    onClick={() => submitHandler(-1)}
                    stop={1} initialRate={rating === -1 ? 1 : 0}
            />
        </span>
    );
};

export default Rating;