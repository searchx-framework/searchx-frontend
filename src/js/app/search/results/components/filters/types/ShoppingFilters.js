import React from 'react';
import ReactStars from 'react-stars'

const getDepartment  = function (departments, filterChangeHandler) {

    let list = departments.map((department) => {
        return (<div className="form-check">
        <label className="form-check-label">
            <input type="radio" className="form-check-input" name="categories"   onChange={filterChangeHandler} value={department[0]} />{department[0]} ({department[1]})
        </label>
        </div>)
    });
    return (
        <div> <p className="filterTitle">Department</p>
        {list}

        </div>
    );
}


const getBrand  = function (brands, filterChangeHandler) {
    let list = brands.map((brand) => {
        return (<div className="form-check">
        <label className="form-check-label">
            <input type="checkbox" className="form-check-input" name="brand" onChange={filterChangeHandler} value={brand[0]}/>{brand[0]} ({brand[1]})
        </label>
        </div>)
    });
    return (
        <div> <p className="filterTitle">Brand</p>
        {list}

        </div>
    );
}


const getRatings  = function (ratings, filterChangeHandler) {
    let list = ratings.map((rating) => {
        return (<div className="form-check">
        <label className="form-check-label">
            <input type="radio" className="form-check-input" name="rating"   onChange={filterChangeHandler} value={rating[0]} />
           
            <ReactStars
                     count={5} value={rating[0]} edit={false} half={true}

                size={13}
                color2={'#ffd700'} />&nbsp; & Up ({rating[1]}) 
        </label>
        </div>)
    });
    return (
        <div> <p className="filterTitle">Avg Customer Review</p>
        {list}

        </div>
    );
}


const getPrice  = function (prices, filterChangeHandler) {
    if (prices.length === 1) {
        return <div></div>
    }
    let list;
    list = [
    (<div className="form-check">
    <label className="form-check-label">
        <input type="radio" className="form-check-input" name="price" onChange={filterChangeHandler}  value={prices[0][0]+ "-"+ prices[0][1] }/>Under ${prices[0][1]} ({prices[0][2]})
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
                <input type="radio" className="form-check-input" name="price" onChange={filterChangeHandler}  value={prices[i][0]+ "-"+ prices[i][1]}/>${prices[i][0]} to ${prices[i][1]} ({prices[i][2]})
            </label>
            </div>)
        )
    }
    if (prices[i][1] > 0 ) { 
        list.push(
            (<div className="form-check">
            <label className="form-check-label">
                <input type="radio" className="form-check-input" name="price" onChange={filterChangeHandler} value={prices[i][0]}/>${prices[i][0]} & Above ({prices[i][1]})
            </label>
            </div>)
        ) 
    }

    return (
        <div> <p className="filterTitle">Price</p>
        {list}

        </div>
    );
}





const ShoppingFilters= function ({searchState, filterChangeHandler, filterHandler}) {

    let department;
    let brand;
    let rating;

    let categoryFilterChange = function(data) {
        filterChangeHandler(data,  "single");
    }

    let price;
    if ('Category Facet' in searchState.facets) {
        department = getDepartment(searchState.facets["Category Facet"], categoryFilterChange);
    }

    if ('Brand Facet' in searchState.facets) {
        brand = getBrand(searchState.facets["Brand Facet"], filterChangeHandler);
    }

    let priceFilterChange = function(data) {
        filterChangeHandler(data,  "single");
    }

    if ('Price Facet' in searchState.facets) {
        price = getPrice(searchState.facets["Price Facet"], priceFilterChange);
    }

    if ('Rating Facet' in searchState.facets) {
        rating = getRatings(searchState.facets["Rating Facet"], categoryFilterChange);
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