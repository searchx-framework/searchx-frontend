import './ForumSearchResults.css';

import React from 'react';
import ForumSearchResult from './ForumSearchResult';


export default class ForumSearchResults extends React.Component {


    constructor() {
        super();
    }


    render() {

        let results = this.props.results.map((result, index) => {
            return (
                <ForumSearchResult result={result} key={index} 
                    query={this.props.query} page={this.props.page} serp_id = {this.props.serp_id}/>
            );
        });
        return (

            <div className="row ForumSearchResults">

                <div className="col-xs-12">

                    {results}

                </div>

            </div>
        )
    }
};