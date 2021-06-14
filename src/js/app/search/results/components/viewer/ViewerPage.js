import React from 'react';
import Loader from 'react-loader';
import isImage from 'is-image';

export default class ViewerPage extends React.Component {
    componentDidMount() {
        if (this.props.doctext) {
            this.props.loadHandler();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.doctext && prevProps.url !== this.props.url) {
            prevProps.loadHandler();
        }
    }
    
    createHTML(text) {
        return {__html: text};
    }
    

    render() {
        return (
            <div className="page">
                {this.props.doctext ? (
                        <div className={"textBackground"}>
                            <div className={"documentText"} >
                                    {this.props.doctext}
                           
                            </div>
                        </div>
                    ) :
                    [
                        <div id="viewer-content-loader">
                            <Loader/>
                        </div>,
                        isImage(this.props.url) ?
                            <img src={this.props.url} onLoad={this.props.loadHandler} alt={this.props.url}/>
                            :
                            <iframe title={this.props.url} scrolling="yes"
                                    frameBorder="0"
                                    src={`${process.env.REACT_APP_RENDERER_URL}/${this.props.url}`}
                                    onLoad={this.props.loadHandler}>
                            </iframe>
                    ]
                }
            </div>
        )
    }
};