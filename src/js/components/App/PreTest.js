

import React from 'react';

import * as Survey from 'survey-react';
import taskStore from '../../stores/TaskStore';

import AccountStore from '../../stores/AccountStore';

export default class PreTest extends React.Component {

   componentWillMount() {    
    Survey.Survey.cssType = "bootstrap";
    Survey.defaultBootstrapCss.navigationButton = "btn btn-green";

  }

  render() {  

    var data = taskStore.getPreTest();

    var survey = new Survey.Model(data); 
    
    survey.onComplete.add( function(result){
        //TODO send result.data to server
        var topicId = taskStore.getTopicFromResults(result.data);
        AccountStore.setTaskId(topicId);
    });
    
    return (
      <div> 
          <Survey.Survey model={survey}/>
        </div>
      
    );
  }
}