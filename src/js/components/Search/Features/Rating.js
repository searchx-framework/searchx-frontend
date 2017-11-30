import './Rating.css';
import React from 'react';

import AccountStore from '../../../stores/AccountStore';

class Rating extends React.Component {

    render(){
        let buttonUpClass = this.props.upPressed ? "btn btn-default active" : "btn btn-default";
        let buttonDownClass = this.props.downPressed ? "btn btn-default active" : "btn btn-default";
        if (!AccountStore.getAorB()) {
            return (<div className = "Rating" />);
        }
        return  (
            <div className = "Rating" >
                <div className = "UpRating">
                    <a className={buttonUpClass} onClick={this.props.onUpRating}><span className="glyphicon glyphicon-chevron-up"></span></a> 
                </div>
                <h5>{this.props.rating}</h5>
                <div className = "DownRating"> 
                <a className={buttonDownClass} onClick={this.props.onDownRating}><span className="glyphicon glyphicon-chevron-down"></span></a>
                </div>
            </div>
        )
    }
}

export default (Rating);