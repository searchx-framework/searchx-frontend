import './Survey.css'
import React from 'react';

class Welcome extends React.Component {
    render() {
        return (
            <div className="Welcome">
                
                <div className="row text-center">
                    <div className="col-md-12"> 
                        <div className="Info" > 

                        <h3>In this experiment, you are tasked with learning about a given subject. This experiment is composed of three parts:</h3>

                        <ol type="1">
                            <li><b>Diagnostic test</b>. This is a multiple-choice question test to find out what you already know. Please answer honestly. Your payment is not be affected by the number of correct or incorrect answers.</li>
                            <li><b>Learning phase</b>. We want you to use our custom Web search system (we call it "SearchX") to learn about a given topic. You are given 20 minutes to search for documents about that topic. You need to collect and save all the webpages, publications, and other online sources that are helpful for you to learn about the topic. Please use only SearchX to learn, not any other search engine.</li>
                            <li><b>Final test</b>. We will give 13 exercises for you to complete; those exercises include questions about the given topic and the writing of an outline for your a paper about this topic. Please answer honestly. Your payment is not affected by the number of correct or incorrect answers.</li>
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