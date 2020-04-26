import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';
import {generateSnippetText} from '../../../../../utils/SimpleSnippetFragmentGenerator'

////

const CovidSearchResult = function ({
                                       searchState, serpId, index, result, metadata, bookmarkButton, excludeButton,
                                       urlClickHandler, hideCollapsedResultsHandler, isCollapsible, visited
                                   }) {
    let metaInfo = {
        url: result.id,
        docno: result.collectionId,
        index: index,
        query: searchState.query,
        page: searchState.page,
        serpId: serpId,
        session: localStorage.getItem("session-num") || 0,
    };
    // console.log(result)
    let clickUrl = () => {

        var doctext = result.text.split('\n').map((item, key) => {
            const regex = /CC-BY.*medRxiv preprint/g;
            let cleaned_item = item.replace(regex, '');
            const regex2 = /All rights reserved. No reuse allowed without permission./g;
            let cleaned_item1 = cleaned_item.replace(regex2, '');
            const regex3 = /author\/funder, who has granted medRxiv a license to display the preprint in perpetuity./g;
            let cleaned_item2 = cleaned_item1.replace(regex3, '');
            const regex4 = /The copyright holder for this preprint.*preprint/g;
            let cleaned_item3 = cleaned_item2.replace(regex4, '');
            const regex5 = /\. CC-BY-NC-ND 4.0.*under a/g;
            let cleaned_item4 = cleaned_item3.replace(regex5, '');
            const regex6 = /The copyright holder for this preprint/g;
            let cleaned_item5 = cleaned_item4.replace(regex6, '');
            const regex7 = /is the \(which was not peer-reviewed\)/g;
            let cleaned_item6 = cleaned_item5.replace(regex7, '');
            const regex8 = /\(which was not peer-reviewed\) is the/g;
            let cleaned_item7 = cleaned_item6.replace(regex8, '');
            const regex9 = /https\:\/\/.*/g; //eslint-disable-line
            let cleaned_item8 = cleaned_item7.replace(regex9, '');


            return <p><span key={key}>{cleaned_item8}<br/></span> </p>
        })

        // doctext.unshift(<h4> {result.source} <br/></h4>);
        doctext.unshift(<h3> <br/> <b>Full Text:</b> <br/></h3>);
        doctext.unshift( <div align="left">  {" "} {result.abstract} <br/></div>);
        doctext.unshift(<h3 >  <b>Abstract:</b> <br/></h3>);
        doctext.unshift( <p> {result.author.join("; ")} <br/></p>);
        doctext.unshift(<h4> <b>Authors:</b> <br/></h4>);
        doctext.unshift(<h2> {" "} {result.name} <br/></h2>);
       

        

        urlClickHandler(result.id, doctext);
        log(LoggerEventTypes.SEARCHRESULT_CLICK_URL, metaInfo);
    };

    let viewUrl = (isVisible) => {
        metaInfo.isVisible = isVisible;
        log(LoggerEventTypes.SEARCHRESULT_VIEW_URL, metaInfo);
    };

    let contextUrl = () => {
        log(LoggerEventTypes.SEARCHRESULT_CONTEXT_URL, metaInfo);
    };

    let hoverEnterSummary = () => {
        log(LoggerEventTypes.SEARCHRESULT_HOVERENTER, metaInfo);
    };

    let hoverLeaveSummary = () => {
        log(LoggerEventTypes.SEARCHRESULT_HOVERLEAVE, metaInfo);
    };

    function createSnippet() {
        /* result.text and searchState.query */
        /* generateSnippetText(result.text, searchState.query) */
        return {__html: generateSnippetText(result.text, searchState.query)};
    }

    const hideCollapsedResults = function () {
        const collapseMetaInfo = {
            urls: [result.id],
            query: searchState.query,
            page: searchState.page,
            serpId: serpId,
        };
        log(LoggerEventTypes.SEARCHRESULT_HIDE_COLLAPSED, collapseMetaInfo);
        const id = result.id ? result.id : result.url;
        hideCollapsedResultsHandler([id]);
    };

    const toTitleCase = function(str) {
        return str.replace(
            /\w\S*/g,
            function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    if (result.name === result.name.toUpperCase()) {
        result.name = toTitleCase(result.name);
    }
  
    
    const getAuthorString = function(str) {
        let author_string = '';
        let authors = str;
        if (authors.length > 5) {
            
            authors.forEach((element ,idx) => {
                // console.log(element)
                if(idx <=5) {
                author_string = author_string.concat(element, "; ")
                }
                
            });
            author_string = author_string.concat("...")
            return author_string
            
        } else {
            author_string = result.author
            return author_string
        }
    }

    ////
    
    return (
        <div className="result-text">
            <VisibilitySensor
                onChange={viewUrl}
                scrollCheck
                delayedCall={true}
                scrollThrottle={50}
                intervalDelay={2000}
            />

            {bookmarkButton}
            {excludeButton}

            <div onMouseEnter={hoverEnterSummary} onMouseLeave={hoverLeaveSummary}>
                <h2>
                    <a className={visited ? "visited" : ""} href="#/"  title={result.name} onClick={clickUrl}
                       onContextMenu={contextUrl}>
                        {result.name}
                    </a>
                </h2>
                <div>
                    <p> {getAuthorString(result.author)}. <i> {result.journal === "nan" ? "" : result.journal} </i> ({result.pubtime})  &nbsp;
                    <a href= {result.url} target="_blank" rel="noopener noreferrer"
                       onContextMenu={contextUrl}>
                         [Link]
                    </a>
                    </p>
                </div>

                {isCollapsible ? (
                    <div className="textArea" draggable="true" role="button" onClick={hideCollapsedResults}>
                        <p dangerouslySetInnerHTML={createSnippet()} >
                        </p>

                        {metadata}
                    </div>
                ) : (
                    <div className="textArea">
                        <div className="fakeSpace"></div>
                        <p dangerouslySetInnerHTML={createSnippet()}>
                        </p>

                        {metadata}
                    </div>
                )}

            </div>
        </div>
    )
};

export default CovidSearchResult;
