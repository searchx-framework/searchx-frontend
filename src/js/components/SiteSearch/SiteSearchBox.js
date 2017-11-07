import React from 'react';

export default (props) => {
    let moveCursor = (e) => {
        // Places the cursor at the end of input
        e.target.value = e.target.value;
    };
    return (
        <div className="row Search-box">
            <div className="col-xs-8">
                <div className="input-group">
                    <input type="text" className="form-control" name="query" placeholder="" value={props.query} onChange={props.changeHandler} autoFocus onFocus={moveCursor} autoComplete={'off'} />
                        <span className="input-group-btn">
                            <button className="btn" type="submit" disabled={props.query.length === 0}>
                                <span className="fa fa-search"></span>
                            </button>
                        </span>
                </div>
            </div>
        </div>
    )
}
