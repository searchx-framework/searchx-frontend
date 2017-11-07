import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import { log } from '../../logger/Logger';
import { LoggerEventTypes } from '../../constants/LoggerEventTypes';


class ForumSearchResult extends React.Component {


    render() {

        var metaInfo = {
            url: this.props.result.displayUrl,
            query: this.props.query,
            page: this.props.page,
            vertical: 'forums',
            serp_id: this.props.serp_id,
        }

        let clickUrlLog = (e) => {
            log(LoggerEventTypes.SEARCHRESULT_CLICK_URL, metaInfo)
        };

        let viewUrlLog = (isVisible) => {
            var metaInfoView = {metaInfo, isVisible: isVisible};
            log(LoggerEventTypes.SEARCHRESULT_VIEW_URL, metaInfoView)
        };

        let contextUrlLog = (isVisible) => {
            log(LoggerEventTypes.SEARCHRESULT_CONTEXT_URL, metaInfo)
        };

        let hoverEnterSummary = (e) => {
            log(LoggerEventTypes.SEARCHRESULT_HOVERENTER, metaInfo)
        };

        let hoverLeaveSummary = (e) => {
            log(LoggerEventTypes.SEARCHRESULT_HOVERLEAVE, metaInfo)
        };

        let cName = 'row ForumSearchResults-result';

        return (
            <div className={cName}>
                <VisibilitySensor onChange={viewUrlLog}
                    scrollCheck
                    delayedCall={true}
                    scrollThrottle={50}
                    intervalDelay={2000}
                />
                <div onMouseEnter={hoverEnterSummary} onMouseLeave={hoverLeaveSummary}>
                    <h2>
                        <a href={this.props.result.url} title={this.props.result.name} target="_blank"
                            onClick={clickUrlLog}
                            onContextMenu={contextUrlLog}>
                            {this.props.result.name}
                        </a>
                    </h2>
                    <span>
                        {this.props.result.displayUrl}
                    </span>

                    <p>
                        {this.props.result.snippet}
                    </p>
                </div>
            </div>

        )

    }
}

export default (ForumSearchResult);