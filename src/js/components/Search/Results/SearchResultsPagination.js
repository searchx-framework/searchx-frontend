import React from 'react';
import Pagination from "react-js-pagination";

function isWebOrNews(vertical){
    return vertical === "web" || vertical === "news";
}

function isImagesOrVideos(vertical){
    return vertical === "images" || vertical === "videos";
}

function validatePagination(vertical,length) {
    if (isWebOrNews(vertical) && length <= 10) {
        return false;
    } else if (isImagesOrVideos(vertical) && length <= 12) {
        return false;
    } else if (vertical === 'forums' && length <= 20) {
        return false;
    } 
    return true;
}

export default (props) => {
    return (
        <div className={isImagesOrVideos(props.vertical)? 'col-xs-12 text-center' :  'col-xs-12 text-center'}>
            {validatePagination (props.vertical, props.length) && props.finished ?
                <Pagination className="pagination"

                    activePage={props.activePage}
                    itemsCountPerPage={10}
                    totalItemsCount={450}
                    pageRangeDisplayed={5}
                    onChange={props.handlePageChange}

                    firstPageText={<i className='glyphicon glyphicon-chevron-left'/>}
                    lastPageText={<i className='glyphicon glyphicon-chevron-right'/>}
                    prevPageText={<i className='glyphicon glyphicon-menu-left'/>}
                    nextPageText={<i className='glyphicon glyphicon-menu-right '/>}

                />

            : "" }
        </div> 
    )
}