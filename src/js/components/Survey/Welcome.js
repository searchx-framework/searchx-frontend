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
                            <li><a href="https://www.whatismybrowser.com/" target="_blank">Check here</a> if the version of your browser meets our requirements: Google Chrome version 47 (or higher) and Mozilla Firefox version 44 (or higher).  </li>
                        </ol> 
                        <hr/>

                        <h3>In this experiment, you are tasked with learning about a given topic. This experiment is composed of three parts:</h3>

                        <ol type="1">
                            <li><b>Diagnostic test</b>. This is a multiple-choice question test to find out what you already know. Please answer honestly. Your payment is not be affected by the number of correct or incorrect answers.</li>
                            <li><b>Learning phase</b>. We want you to use our custom Web search system (we call it "SearchX") to learn about a given topic. You are given 20 minutes to search for documents about that topic. You need to collect and save all the Web pages, publications, and other online sources that are helpful for you to learn about the topic. 
                            Please use only SearchX to learn about the given topic. Do not use any other Web search engine or search for a different topic (e.g. your topic is <i>computer science</i>, we consider searches for <i>tomorrow's weather</i>, <i>the latest news</i>, <i>movie reviews</i>, etc. as severely off-topic). If you conduct such off-topic searches you will not get paid.</li>
                            <li><b>Final test</b>. We will give you 13 exercises to complete to see how much you have learned while searching; those exercises include questions about the given topic and the writing of an outline for your paper about this topic. 
                            Please answer honestly. Your payment is not affected by the number of correct or incorrect answers. Note that your answers must exceed a minimum word count and be on your assigned topic.</li>
                        </ol>  
                        <hr/>
                        <h3>You will need approximately 40 minutes to complete the work.</h3>
                        <hr/>

                        <h3>IMPORTANT:</h3>
                            <h4>We do not pay if:</h4>
                            <ul>
                            <li> your answers are shorter than the required word count </li>
                            <li> your answers are off-topic </li>
                            <li> during the Diagnostic test and the Final test you change to a different tab more than three times (you will receive a warning ahead of time). Note that during the search phase, tab changes are expected as the search results open in new tabs. </li>
                        </ul>
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