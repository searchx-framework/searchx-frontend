import React from 'react';

import SessionActions from "../../../../actions/SessionActions";
import RatingStore from "./RatingStore";
import Rating from "./components/Rating";

export default class RatingContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = RatingStore.getUrlRating(this.props.url);

        SessionActions.getRating(this.props.url);
        this._onChange = this._onChange.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    componentDidMount() {RatingStore.addChangeListener(this._onChange);}
    componentWillUnmount() {RatingStore.removeChangeListener(this._onChange);}
    _onChange() {
        if (this.props.url) {
            this.setState(RatingStore.getUrlRating(this.props.url));
        }
    }

    submitHandler(rating) {
        if (rating === this.state.rating) rating = 0;
        SessionActions.submitRating(this.props.url, rating);
    }

    render() {
        return <Rating
            rating={this.state.rating}
            total={this.state.total}
            submitHandler={this.submitHandler}
        />
    }
}