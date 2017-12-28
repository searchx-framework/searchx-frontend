import './Survey.css'
import React from 'react';
import {Link} from 'react-router-dom';

class Welcome extends React.Component {
    render() {

        var switchTabsPreTest = localStorage.getItem("switchTabsPreTest");
        
        var switchTabsPostTest = localStorage.getItem("switchTabsPostTest");
        
        if (switchTabsPreTest >= 3 || switchTabsPostTest >= 3) {
            return (
                <div/>
            );
        }


        return (
            <div className="Welcome">
                
                <div className="row text-center">
                    <div className="col-md-12"> 
                        <div className="Info" > 

                        <h3>Requirements:</h3>
                        <ol type="1">
                            <li>This experiment will be in English. You must do everything in English.</li>
                            <li><a href="https://www.whatismybrowser.com/" target="_blank">Check here</a> if the version of your browser meets our requirements: Google Chrome 47+ and Mozilla Firefox 44+.  </li>
                        </ol> 
                        <hr/>

                        <h3>In this experiment, you are tasked with learning about a given topic. This experiment is composed of three parts:</h3>

                        <ol type="1">
                            <li><b>Diagnostic test</b>. This is a multiple-choice question test to find out what you already know. Please answer honestly. Your payment is not be affected by the number of correct or incorrect answers.</li>
                            <li><b>Learning phase</b>. We want you to use our custom Web search system (we call it "SearchX") to learn about a given topic. You are given 20 minutes to search for documents about that topic. You need to collect and save all the Web pages, publications, and other online sources that are helpful for you to learn about the topic. 
                            Please use only SearchX to learn about the given topic. Do not use any other Web search engine or search for a different topic (e.g. your topic is <i>computer science</i> and you search for <i>tomorrow's weather</i> or <i>new films in 2018</i>), you will not get the payment if this happen.</li>
                            <li><b>Final test</b>. We will give you 13 exercises to complete to see how much you have learned while searching; those exercises include questions about the given topic and the writing of an outline for your paper about this topic. 
                            Please answer honestly. Your payment is not affected by the number of correct or incorrect answers. However, your answers must have a minimum length (word counts) and in agreement with your topic (e.g, your topic is <i>computer science</i> and you wrote a summary about your <i>neighbour's cat</i>).</li>
                        </ol>  
                        <hr/>
                        <h3>You will need approximately 40 minutes to complete the work.</h3>
                        <hr/>

                        <h3>IMPORTANT: Payment</h3>
                            <h4> We pay based on how well you participate in this experiment. We will monitor your behaviour during all experiment and you may forfeit your payment at some steps of this work if you do not behave properly
                            (e.g., in the Diagnostic test and Final test you must not change to a different tab/window, except during Learning phase where you are encouraged to open new tabs for reading a document).</h4>
                        <hr/>
                        <h3>BONUS</h3>
                         <h4>
                            A bonus payment will be given to workers that complete this experiment with good answers.
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