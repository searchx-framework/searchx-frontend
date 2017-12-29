import './NewsSearchResults.css';

import React from 'react';
import NewsSearchResult from './NewsSearchResult';
import BookmarkResults from '../BookmarkResults';



export default class  NewsSearchResults extends React.Component {


    

    render () {
        let results = this.props.results.map((result, index) => {
            return (
                <NewsSearchResult result={result} key={index} bookmark={0}
                query={this.props.query} page={this.props.page} serp_id = {this.props.serp_id} />
            );
        });
        
        return (
            <div className="row NewsSearchResults">
                <div className="col-xs-6">
                    {results}
                </div>

                <div className="col-xs-6" >

                 <BookmarkResults />
                </div >
            </div>


        )
    }
};