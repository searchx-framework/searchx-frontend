import './Survey.css'
import React from 'react';
import {Link} from 'react-router-dom';

import TaskStore from "../../stores/TaskStore";
import config from "../../config";
import AccountStore from "../../stores/AccountStore";

const NUM_EXERCISES = 13;
const WAITING_TIME = config.groupTimeout;
const TASK_DURATION = config.taskDuration;

////

class Welcome extends React.Component {
    render() {
        if (TaskStore.isOverSwitchTabsLimit()) {
            return (
                <div/>
            );
        }

        return (
            <div className="Welcome">
                <div className="row">
                    <div className="col-md-12"> 
                        <div className="Info" >
                            <h3>Requirements:</h3>
                            <ol type="1">
                                <li>
                                    <a href="https://www.whatismybrowser.com/" target="_blank">Check here</a> if the version of your browser meets our requirements:
                                    Google Chrome version 47 (or higher) and Mozilla Firefox version 44 (or higher).
                                </li>
                            </ol>

                            {AccountStore.isCollaborative() &&
                                <div>
                                    <hr/>
                                    <h3>Payment:</h3>
                                    <ol type="1">
                                        <li><b>Full Payment</b>
                                            <p>
                                                If you finished the study through the completion link.
                                                This is only possible if you were assigned a partner and together completed the learning phase and final test.
                                            </p>
                                        </li>
                                        <li><b>Partial Payment</b>
                                            <p>
                                                If you completed the Diagnostic test and waited, but did not receive a partner.
                                                You will only receive the partial payment if you clicked on <b>"Stop without completing"</b> (instead of "I've finished" or "Submit study").
                                                This payment will be delivered through a bonus payment which doesn't require you to finish the study.
                                            </p>
                                        </li>
                                    </ol>
                                </div>
                            }

                            <hr/>
                            <h3>
                                In this study, you are tasked with learning about a given topic in collaboration with a fellow Prolific worker.
                                This study is composed of three parts:
                            </h3>
                            <ol type="1">
                                <li><b>Diagnostic Test (by yourself)</b>.
                                    <p>
                                        This is a multiple-choice question test to find out what you already know.
                                        Please answer honestly. Your payment is not affected by the number of correct or incorrect answers.
                                    </p>
                                    <p>
                                        Since this is a collaborative task, after the Diagnostic test you will need to wait for a partner.
                                        How much time that takes depends on how many other Prolific workers are active right now.
                                        We ask you to wait for {WAITING_TIME} minutes. We will notify you when you have waited long enough.
                                        Then, please follow the instructions for a partial payment.
                                    </p>
                                </li>
                                <li><b>Collaborative Learning Phase</b>.
                                    <p>
                                        We want you, together with your assigned partner (another Prolific worker), to use our custom web search system (we call it "SearchX") to learn about a given topic.
                                        You are given {TASK_DURATION} minutes to search for documents about that topic.
                                        You need to collect and save all the Web pages, publications, and other online sources that are helpful for you to learn about the topic.
                                    </p>
                                    <p>
                                        Please use only SearchX to learn about the given topic.
                                        Do not use any other web search engine or search for an unrelated topic
                                        (e.g. your topic is <i>computer science</i>, we consider searches for <i>tomorrow's weather</i>, <i>the latest news</i>, <i>movie reviews</i>, etc. as severely off-topic).
                                        If you conduct such off-topic searches, we will cancel your participation.
                                    </p>
                                    <p>
                                        In order to learn and search together, we provide you with:
                                        a chat window so that you can communicate with your partner (when asked for a chat name, choose any name you like),
                                        a shared query history so that you can see what your partner is currently searching for
                                        and a shared bookmarking list so that you can easily share worthwhile documents.
                                    </p>
                                </li>
                                <li><b>Final Test (by yourself)</b>.
                                    <p>
                                        We will give you {NUM_EXERCISES} exercises to complete to see how much you have learned through the learning phase;
                                        those exercises include questions about the given topic and the writing of an outline for your paper about the given topic.
                                        Please answer honestly. Your payment is not affected by the number of correct or incorrect answers.
                                        Note that your answers must exceed a minimum word count and be on your assigned topic.
                                    </p>
                                </li>
                            </ol>

                            <hr/>
                            <h3>You will need approximately 55 minutes to complete the whole study.</h3>

                            <hr/>
                            <h3>IMPORTANT!</h3>
                            <h4>We will reject your participation if:</h4>
                            <ul>
                                <li> your answers are shorter than the required word count </li>
                                <li> your answers are off-topic </li>
                                <li> during the Diagnostic test and the Final test you change to a different tab more than three times (you will receive a warning ahead of time). Note that during the search phase, tab changes are expected as the search results open in new tabs. </li>
                                <li> you become inactive (no searching/browsing/scrolling/reading web pages/video watching) for more than 5 minutes during the learning phase. </li>
                            </ul>

                            <hr/>
                            <h3> Good Luck and Have Fun! </h3>
                            <Link to="/register" className="btn btn-primary btn-lg pull-right" role="button">Start!</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Welcome;