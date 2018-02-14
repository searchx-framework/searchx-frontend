import React from 'react';

import Annotations from './components/Annotations';
import SessionActions from "../../../../actions/SessionActions";
import AccountStore from "../../../../stores/AccountStore";
import AnnotationsStore from "./AnnotationsStore";
import SessionStore from "../../../../stores/SessionStore";

export default class AnnotationsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            annotations: []
        };

        SessionActions.getAnnotations(this.props.url);
        this._onChange = this._onChange.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.removeHandler = this.removeHandler.bind(this);
    }

    componentWillMount() {AnnotationsStore.addChangeListener(this._onChange);}
    componentWillUnmount() {AnnotationsStore.removeChangeListener(this._onChange);}
    _onChange() {
        this.setState({
            annotations: AnnotationsStore.getActiveUrlAnnotations().map((data) => {
                data.userColor = SessionStore.getMemberColor(data.userId);
                return data;
            })
        });
    }

    submitHandler(annotation) {
        SessionActions.addAnnotation(this.props.url, annotation);
    }

    removeHandler(position) {
        SessionActions.removeAnnotation(this.props.url, position);
    }

    render() {
        return <Annotations
            annotations={this.state.annotations}
            submitHandler={this.submitHandler}
            removeHandler={this.removeHandler}
            userId={AccountStore.getUserId()}
        />
    }
}