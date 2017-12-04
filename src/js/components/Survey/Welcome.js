import React from 'react';
import './Welcome.css'

class Welcome extends React.Component {
    constructor() {
        super();
    }

    render() {
       
        return (
            <div className="Welcome">
                
                <div className="row text-center">
                    <div className="col-md-12"> 
                        <div className="Info" > 

                        <h3>In this experiment, you are tasked with learning about a given subject. This experiment is composed of three parts:</h3>

                        <ol type="1">
                            <li><b>Diagnostic test</b>. This is a multiple-choice question test to find out what you already know. Please answer honestly. Your payment is not be affected by the number of correct or incorrect answers.</li>
                            <li><b>Learning phase</b>. We want you to use our custom Web search system (we call it "SearchX") to learn about a given topic. You are given 15 minutes to search for documents about that topic - and to browse/read them of course. Please use only SearchX to learn, not any other search engine.</li>
                            <li><b>Final test</b>. We will give you another multiple-choice question test to see how much you've learned. Please answer honestly. Your payment is not affected by the number of correct or incorrect answers.</li>
                        </ol>  

                        <h3> Good Luck and Have Fun! </h3> 
                        <a href="/register" className="btn btn-primary pull-right btn-lg" role="button">Start!</a>
                         </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Welcome;