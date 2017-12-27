import './Survey.css'
import React from 'react';
import {Link} from 'react-router-dom';

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
                            <li><b>Learning phase</b>. We want you to use our custom Web search system (we call it "SearchX") to learn about a given topic. You are given 20 minutes to search for documents about that topic. You need to collect and save all the Web pages, publications, and other online sources that are helpful for you to learn about the topic. 
                            Please use only SearchX to learn about the given topic. Do not use any other Web search engine or search for a different topic, you may not get the payment.</li>
                            <li><b>Final test</b>. We will give you 13 exercises to complete to see how much you have learned while searching; those exercises include questions about the given topic and the writing of an outline for your paper about this topic. 
                            Please answer honestly. Your payment is not affected by the number of correct or incorrect answers. However, we automatically evaluate the quality of your answers and we pay you only if you achieve a minimum answer quality.</li>
                        </ol>  
                        <hr/>
                        <h3>Requirements:</h3>
                        <ol type="1">
                            <li> This experiment will be in English. You must write all your answers and conduct your searches in English. You may not get the payment if you use other languages.</li>
                            <li> Check whether the version of your browser meets our requirements: Google Chrome 47+ and Mozilla Firefox 44+. </li>
                        </ol> 
                        <hr/>
                        <h3>This experiment takes about 40 minutes on average.</h3>
                        <hr/>

                        <h3>IMPORTANT: Payment</h3>
                            <h4> We pay based on how well you participate in this experiment. We will evaluate your behavior during all experiment and we will automatically decide if we pay you at the end of the experiment. In order to avoid any complications, reserve the amount of time of 40 minutes to focus only on this experiment.</h4>
                        <h3>BONUS</h3>
                         <h4>
                            A bonus payment will be given to workers that complete this experiment with high-quality answers.
                        </h4> 
                        <hr/>
                        <h3> Good Luck and Have Fun! </h3> 
                        <Link to="/register" className="btn btn-primary pull-right btn-lg" role="button">Start!</Link>
                        
                         </div>
                         
                    </div>
                    
                </div>
            </div>
        )
    }
}

export default Welcome;