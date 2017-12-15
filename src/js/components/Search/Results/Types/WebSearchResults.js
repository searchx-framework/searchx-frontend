import './WebSearchResults.css';

import React from 'react';
import WebSearchResult from './WebSearchResult';
import BookmarkResults from '../BookmarkResults';


export default class WebSearchResults extends React.Component {
    
    constructor() {
        super();
    }

    render() {
         
        let results = this.props.results.map((result, index) => {
            return (
                <WebSearchResult result={result} key={index}
                 query={this.props.query} page={this.props.page} serp_id = {this.props.serp_id} bookmark={0}/>
            );
        });


        return (
            
            <div className="row WebSearchResults" >
                 
                <div className="col-xs-6" >
                   
                    {results}
      
                </div>

                <div className="col-xs-6" >

                 <BookmarkResults />
                </div >
                
            </div>
        )
    }
};