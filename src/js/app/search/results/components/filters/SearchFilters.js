import React from "react";

import FiltersStore from "./FiltersStore";

import config from "../../../../../config";
import Col from "react-bootstrap/Col";

export default class SearchFiltersContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            facets: []
        };

        this.changeHandler = this.changeHandler.bind(this);

    }

    componentDidMount() {FiltersStore.addChangeListener(this.changeHandler);}
    componentWillUnmount() {FiltersStore.removeChangeListener(this.changeHandler);}


    render() {

        const props = {
            facets: this.state.facets,
            selectedFilters: this.props.selectedFilters,
            filterChangeHandler: this.props.filterChangeHandler,
            filterHandler: this.props.filterHandler
        };


        const FiltersType = config.providerFilters[this.props.provider];
        const view = <FiltersType {...props}/>;
        return (
                <Col className="SearchFilters" sm={3}>
                        {view}
                </Col>
        );

    }

    

    changeHandler() {
        let facets = FiltersStore.getFacets();
        this.setState({
            facets: facets
        });
    }
}