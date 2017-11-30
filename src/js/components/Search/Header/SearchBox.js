import React from 'react';
import './Search.css'

class SearchBox extends React.Component {
    
    moveCursor (e) {
        // Places the cursor at the end of input
        e.target.value = e.target.value;
    }

    render () {
        return (
            <div className="row Search-box">
                <div className="col-xs-12">
                    <div className="input-group">
                        <input type="text" className="form-control" name="query" placeholder="" value={this.props.query} onChange={this.props.changeHandler} autoFocus onFocus={this.moveCursor} autoComplete={'off'} />
                            <span className="input-group-btn">
                                <button className="btn" type="submit" disabled={this.props.query.length === 0}>
                                    <span className="fa fa-search"></span>
                                </button>
                            </span>
                    </div>
                </div>
            </div>
        )
    }
}

export default SearchBox;
