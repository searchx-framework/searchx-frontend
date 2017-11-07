import './VideosSearchResults.css';

import React from 'react';
import VideosSearchResult from './VideosSearchResult';

export default class VideosSearchResults extends React.Component {

    render() {
        let results = this.props.results.map((result, index) => {
            return (
                <VideosSearchResult result={result} key={index} 
                query={this.props.query} page={this.props.page} serp_id = {this.props.serp_id}/>
            );
        });

        return (
            <div className="row VideosSearchResults">
                <div className="col-xs-12">
                    {results}
                </div>
            </div>
        )

    }

};