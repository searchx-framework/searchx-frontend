import './Search.pcss';
import React from 'react';

import PropTypes from "prop-types";
import SearchHeaderContainer from './header/SearchHeaderContainer';
import SearchResultsContainer from "./results/SearchResultsContainer";
import QueryHistoryContainer from "./features/queryhistory/QueryHistoryContainer";
import BookmarkContainer from "./features/bookmark/BookmarkContainer";
import BasketContainer from "./features/basket/BasketContainer";
import Chat from "./features/chat/Chat";

class Search extends React.Component {
    constructor(props) {
        super(props);


        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }
    componentDidMount() {
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }

    componentWillUnmount() {
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }

    render() {
        return (
            <div className="Search">
                <SearchHeaderContainer timer={this.props.timer} statusbar={this.props.statusbar} taskbar={this.props.taskbar} showAccountInfo={this.props.showAccountInfo}/>

                <div className="Content">
                    <div className="Main">
                        <div className="SearchResultsContainer">
                            <SearchResultsContainer/>
                        </div>
                    </div>

                    <div className="Side">
                        <QueryHistoryContainer collaborative={this.props.collaborative}/>
                        <BookmarkContainer collaborative={this.props.collaborative}/>
                        <BasketContainer collaborative={this.props.collaborative}/>
                    </div>

                    {this.props.taskDescription && (
                        <div className="Side">
                            {this.props.taskDescription}
                        </div>
                    )}
                </div>
                <Chat/>
                <div className="text-center">
                    <p className="Footer">
                        About <a href="/about" target="_blank">SearchX</a>.
                    </p>
                </div>
            </div>
        )
    }
    handleVisibilityChange() {
        if (document.hidden) {
        
            
            this.props.onSwitchPage();
        }
    }
}
Search.propTypes = {
    onSwitchPage: PropTypes.func
};


Search.defaultProps = {
    collaborative: true,
    showAccountInfo: true,
    firstSession: true,
    lastSession: true,
    onSwitchPage: () => {},
};

export default Search;