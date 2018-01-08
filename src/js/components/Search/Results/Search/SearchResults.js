import './SearchResults.css';

import React from 'react';
import SearchResult from "./SearchResult";

export default class SearchResults extends React.Component {
    render() {
        let cName = "WebSearchResults";
        if (this.props.vertical === 'news') cName = "NewsSearchResults";
        if (this.props.vertical === 'images') cName = "ImagesSearchResults";
        if (this.props.vertical === 'videos') cName = "VideosSearchResults";

        ///

        let results = this.props.results.map((result, index) => {
            const props = {
                result: result,
                query: this.props.query,
                vertical: this.props.vertical,
                page: this.props.page,
                serp_id: this.props.serp_id,
                bookmark: 0
            };

            return(<SearchResult {...props} key={index}/>);
        });

        return (
            <div className={"row " + cName}>
                <div className="col-xs-12" id="intro-search-results">
                    {results}
                </div>
            </div>
        )
    }
};