import React from 'react';
import {Link} from 'react-router-dom';

const TaskBar = function({description, onSubmit}) {
    return(
        <div className="Task">
            <div className="Task-box timer">
                <div className="Task-submit">
                    <Link className={"btn btn-primary"} to="/feedback" role="button" onClick={onSubmit}>
                        To Feedback
                    </Link>
                </div>
            </div>

            <div className="Task-box instruction">
                <div className="Task-title">
                    Task Description
                </div>

                <div className="Task-info" id="intro-description">
                    <div className="Task-info no-padding">
                        Together with the class, find the answer to this puzzle, using SearchX only:

                        <hr/>

                        <div className="Task-instruction-specific">
                            <b> {description} </b>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default TaskBar;