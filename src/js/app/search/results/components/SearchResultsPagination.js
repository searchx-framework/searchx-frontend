import React from 'react';
import Pagination from "react-js-pagination";
import './SearchResults.pcss';

function isWebOrNews(vertical) {
    return vertical === "web" || vertical === "news";
}

function isImagesOrVideos(vertical) {
    return vertical === "images" || vertical === "videos";
}

function validatePagination(vertical, length) {
    if (isWebOrNews(vertical) && length <= 10) {
        return false;
    }

    if (isImagesOrVideos(vertical) && length <= 12) {
        return false;
    }

    return true;
}

const SearchResultsPagination = function ({searchState, matches, changeHandler}) {
    return (
        <div className="text-center">
            {validatePagination(searchState.vertical, searchState.matches) &&
            <Pagination activePage={searchState.page}
                        onChange={changeHandler}
                        itemClass="page-item"
                        linkClass="page-link"
                        itemsCountPerPage={10}
                        totalItemsCount={450}
                        pageRangeDisplayed={5}
                        hideDisabled={true}
                        hideFirstLastPages={false}

                        prevPageText='Previous'
                        nextPageText='Next'

                        firstPageText='First'
                        lastPageText='Last'
            />

            }
        </div>
    )
};

export default SearchResultsPagination;