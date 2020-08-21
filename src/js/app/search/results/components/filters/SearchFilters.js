import React from 'react';

import config from "../../../../../config";
import Col from "react-bootstrap/Col";

const SearchFilters = function ({
                                   searchState, provider, filterChangeHandler, filterHandler
                               }) {


    const props = {
        searchState: searchState,
        filterChangeHandler: filterChangeHandler,
        filterHandler: filterHandler
    };

    const FiltersType = config.providerFilters[provider];
    const view = <FiltersType {...props}/>;
    return (
            <Col className="SearchFilters" sm={3}>
                    {view}
            </Col>
    );
};

export default SearchFilters;