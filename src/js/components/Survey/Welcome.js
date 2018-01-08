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
        var video = true;

        var num_exercises = 12;

        return (
            <div className="Welcome">
                
                <div className="row text-center">
                    <div className="col-md-12"> 
                        <div className="Info" > 

                        <h3>Requirements:</h3>
                        <ol type="1">
                            <li><a href="https://www.whatismybrowser.com/" target="_blank">Check here</a> if the version of your browser meets our requirements: Google Chrome version 47 (or higher) and Mozilla Firefox version 44 (or higher).  </li>
                        </ol> 
                        <hr/>

                        <h3>In this experiment, you are tasked with learning about a given topic. This experiment is composed of three parts:</h3>

                        <ol type="1">
                            <li><b>Diagnostic test</b>. This is a multiple-choice question test to find out what you already know. Please answer honestly. Your payment is not be affected by the number of correct or incorrect answers.</li>
                            <li> 
                            <b>Learning phase</b>. This phase is composed of two parts:
                                <ol type="1">
                                    <li> <b> Course video</b>. We want you to watch a course video about a given topic. The video will take around 10 minutes to watch. If the video takes longer than 10 minutes, you will receive a bonus payment. You must watch the entire video and not change tabs/windows during this phase. If you change tabs/windows, your participation will be cancelled.</li>
                                    <li> <b> Searching</b>. We want you to use our custom Web search system (we call it "SearchX") to learn about a given topic. You are given 20 minutes to search for documents about that topic. You need to collect and save all the Web pages, publications, and other online sources that are helpful for you to learn about the topic. 
                                    Please use only SearchX to learn about the given topic. Do not use any other Web search engine or search for a different topic (e.g. your topic is <i>computer science</i>, we consider searches for <i>tomorrow's weather</i>, <i>the latest news</i>, <i>movie reviews</i>, etc. as severely off-topic). If you conduct such off-topic searches, we will cancel your participation. </li>
                                </ol>
                            </li>
                            <li><b>Final test</b>. We will give you 13 exercises to complete to see how much you have learned while watching the course video and searching; those exercises include questions about the given topic and the writing of an outline for your paper about this topic. 
                            Please answer honestly. Your payment is not affected by the number of correct or incorrect answers. Note that your answers must exceed a minimum word count and be on your assigned topic.</li>
                        </ol>  
                        <hr/>
                        <h3>You will need approximately 55 minutes to complete the work.</h3>
                        <hr/>

                        <h3>IMPORTANT:</h3>
                        <h4>We cancel your participation if:</h4>
                        <ul>
                            <li> your answers are shorter than the required word count </li>
                            <li> your answers are off-topic </li>
                            <li> during the Diagnostic test, course video, and the Final test you change to a different tab more than three times (you will receive a warning ahead of time). Note that during the search phase, tab changes are expected as the search results open in new tabs. </li>
                            <li> you become inactive (no video watching/searching/browsing/scrolling/reading Web pages) for more than 5 minutes during the learning phase. </li> 
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