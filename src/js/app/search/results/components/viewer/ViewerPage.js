import React from 'react';
import Loader from 'react-loader';

const env = require('env');
const isImage = require('is-image');


export default class ViewerPage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.doctext) {
            this.props.loadHandler();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.doctext && nextProps.url !== this.props.url) {
            nextProps.loadHandler();
        }
    }

    render() {
        return (
            <div className="page">
                {this.props.doctext ? (
                        <div className={"textBackground"}>
                            <div className={"documentText"}>
                                {this.props.doctext}
                            </div>
                        </div>
                    ) :
                    [
                        <div id="modal-loader">
                            <Loader/>
                        </div>,
                        isImage(this.props.url) ?
                            <img src={this.props.url} onLoad={this.props.loadHandler}/>
                            :
                            <iframe scrolling="yes"
                                    frameBorder="0"
                                    src={env.renderUrl + '/' + this.props.url}
                                    onLoad={this.props.loadHandler}>
                            </iframe>
                    ]
                }
            </div>
        )
    }
};