import React from 'react';
import ReactStars from 'react-stars'
import {log} from '../../../../../../utils/Logger';
import {LoggerEventTypes} from "../../../../../../utils/LoggerEventTypes";


const getDepartment  = function (departments, selectedFilters, filterChangeHandler) {

    const metaInfo = {
        filter: "categories"
    };

    const hoverEnter = () => log(LoggerEventTypes.FILTER_HOVERENTER, metaInfo);
    const hoverLeave = () => log(LoggerEventTypes.FILTER_HOVERLEAVE, metaInfo);

    let list = departments.map((department) => {
        return selectedFilters && (selectedFilters === department[0]) ? 
        (
        <div className="form-check">
        <label className="form-check-label">
            <input type="radio" className="form-check-input" name="categories" checked  onChange={filterChangeHandler} value={department[0]} />{department[0]} ({department[1]})
        </label>
        </div>
        )
        :
        (
            <div className="form-check">
            <label className="form-check-label">
                <input type="radio" className="form-check-input" name="categories"   onChange={filterChangeHandler} value={department[0]} />{department[0]} ({department[1]})
            </label>
            </div>
            )
    });
    return (
        <div onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}> <p className="filterTitle">Department</p>
        {list}

        </div>
    );
}


const getBrand  = function (brands, selectedFilters, filterChangeHandler) {

    const metaInfo = {
        filter: "brand"
    };

    const hoverEnter = () => log(LoggerEventTypes.FILTER_HOVERENTER, metaInfo);
    const hoverLeave = () => log(LoggerEventTypes.FILTER_HOVERLEAVE, metaInfo);

    let list = brands.map((brand) => {
        return selectedFilters && selectedFilters.includes(brand[0])?
            (<div className="form-check">
        <label className="form-check-label">
            <input type="checkbox" className="form-check-input" checked={true} name="brand" onChange={filterChangeHandler} value={brand[0]}/>{brand[0]} ({brand[1]})
        </label>
        </div>)
        :
        (<div className="form-check">
        <label className="form-check-label">
            <input type="checkbox" className="form-check-input" name="brand" onChange={filterChangeHandler} value={brand[0]}/>{brand[0]} ({brand[1]})
        </label>
        </div>)
        
    });
    return (
        <div onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}> <p className="filterTitle">Brand</p>
        {list}

        </div>
    );
}


const getRatings  = function (ratings, selectedFilters, filterChangeHandler) {

    const metaInfo = {
        filter: "rating"
    };

    const hoverEnter = () => log(LoggerEventTypes.FILTER_HOVERENTER, metaInfo);
    const hoverLeave = () => log(LoggerEventTypes.FILTER_HOVERLEAVE, metaInfo);

    let list = ratings.map((rating) => {
        let divInput = 
        selectedFilters && (selectedFilters === rating[0].toString()) ?
        (<div>
            <input type="radio" className="form-check-input" name="rating"  checked  onChange={filterChangeHandler} value={rating[0]} />
        </div>)
        :
        (<div>
        <input type="radio" className="form-check-input" name="rating"   onChange={filterChangeHandler} value={rating[0]} />
        </div>)
        return (<div className="form-check">
        <label className="form-check-label">
            {divInput}
            <ReactStars
                     count={5} value={rating[0]} edit={false} half={true}

                size={13}
                color2={'#ffd700'} />&nbsp; & Up ({rating[1]}) 
        </label>
        </div>)
    });
    return (
        <div onMouseEnter={hoverEnter} onMouseLeave={hoverLeave} > <p className="filterTitle">Avg Customer Review</p>
        {list}

        </div>
    );
}

const getInputPrice = function (label, selectedFilters, filterChangeHandler) {
    return  selectedFilters && (selectedFilters === label) ?
    <input type="radio" checked className="form-check-input" name="price" onChange={filterChangeHandler}  value={label}/>
    :
    <input type="radio" className="form-check-input" name="price" onChange={filterChangeHandler}  value={label }/>
}

const getPrice  = function (prices, selectedFilters, filterChangeHandler) {

    const metaInfo = {
        filter: "price"
    };

    const hoverEnter = () => log(LoggerEventTypes.FILTER_HOVERENTER, metaInfo);
    const hoverLeave = () => log(LoggerEventTypes.FILTER_HOVERLEAVE, metaInfo);

    if (prices.length === 1) {
        return <div></div>
    }
    let list;
    list = [
    (<div className="form-check" >
    <label className="form-check-label">
        {getInputPrice( prices[0][0]+ "-"+ prices[0][1],selectedFilters, filterChangeHandler)}Under ${prices[0][1]} ({prices[0][2]})
    </label>
    </div>)
    ]
    let i;
    for (i = 1; i < prices.length-1; i++) {
        if (prices[i][2] === 0) {
            continue;
        }
        list.push(
            (<div className="form-check">
            <label className="form-check-label">
            {getInputPrice( prices[i][0]+ "-"+ prices[i][1],selectedFilters, filterChangeHandler)}${prices[i][0]} to ${prices[i][1]} ({prices[i][2]})
            </label>
            </div>)
        )
    }
    if (prices[i][1] > 0 ) { 
        list.push(
            (<div className="form-check">
            <label className="form-check-label">
            {getInputPrice( prices[i][0].toString(),selectedFilters, filterChangeHandler)}${prices[i][0]} & Above ({prices[i][1]})
            </label>
            </div>)
        ) 
    }

    return (
        <div onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}> <p className="filterTitle">Price</p>
        {list}

        </div>
    );
}







const ShoppingFilters= function ({facets, selectedFilters, filterChangeHandler, filterHandler}) {

    let department;
    let brand;
    let rating;
    if (!facets) {
        return <div></div>
    }
    let categoryFilterChange = function(data) {
        filterChangeHandler(data,  "single");
    }

    let price;
    if ('Category Facet' in facets) {
        department = getDepartment(facets["Category Facet"], selectedFilters.categories, categoryFilterChange);
    }

    if ('Brand Facet' in facets) {
        brand = getBrand(facets["Brand Facet"], selectedFilters.brand, filterChangeHandler);
    }

    let priceFilterChange = function(data) {
        filterChangeHandler(data,  "single");
    }

    if ('Price Facet' in facets) {
        price = getPrice(facets["Price Facet"], selectedFilters.price, priceFilterChange);
    }

    if ('Rating Facet' in facets) {
        rating = getRatings(facets["Rating Facet"], selectedFilters.rating, categoryFilterChange);
    }

    let resetButtonHandler = function(){
        filterHandler("reset");
    }

    let filterButtonHandler = function(){
        filterHandler("filter");
    }


    return (
        <div >
            <form action="/" method="GET" className="filterForm" onSubmit={e => {
                e.preventDefault();
            }}>

                {department}

                {rating}

                {brand}

                {price}

                <div className="row">
                <div className="col-auto filterButton">
                <button onClick={filterButtonHandler} type="submit" className="btn btn-primary">Filter results</button>
                </div>

                <div className="col-auto filterButton">
                <button onClick={resetButtonHandler} className="btn btn-secondary">Reset</button>
                </div>
                </div>


            </form>
        </div>
    )
};

export default ShoppingFilters;