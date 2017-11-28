import React from 'react';
import './Welcome.css'

import Logo from '../Header/Logo';
import {Link} from 'react-router-dom';

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
                            <li><b>Learning phase</b>. You are provided with a custom search system that will help you learn about the subject. Please use it to find and read documents about the subject.</li>
                            <li><b>Final test</b>. We will give you another multiple-choice question test to see how much you've learned. Please answer honestly. Your payment is not affected by the number of correct or incorrect answers.</li>
                        </ol>  

                        <h3> Good Luck and Have Fun! </h3> 
                        <a href="/pretest" className="btn btn-primary pull-right btn-lg" role="button">Start!</a>
                         </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Welcome;