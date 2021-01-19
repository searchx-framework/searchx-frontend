import React from 'react'

const prospectorDescription = (title, description) => (
    <div>


        <p> Imagine you are a reporter for a newspaper. 
        <span style={{"background-color" : "#FFFF00"}}>
            Your editor has just told you to write a story about <font color="#33BEFF"> <strong>{title}</strong></font> together with a group of colleagues. 
        </span> </p>
        <p> However, before you can write the story, <span style={{"background-color" : "#FFFF00"}}>you and your colleagues need to collect in 15 minutes a number of documents that will support writing the story. </span>
            Your group distributes the work by splitting the task into two subtasks: (1) finding documents; and (2) examining them in detail. </p>
        <p><span style={{"background-color" : "#FFFF00"}}>Your job is to identify <strong>as many documents</strong> (news articles) as possible that appear on first sight to be useful (considering different aspects of <font color="#33BEFF"> <strong>{title}</strong> </font>) for the task at hand. </span>
        As you save the documents, they will be shared with your colleagues. 
        <span style={{"background-color" : "#FFFF00"}}>Your colleagues will be examining the saved documents carefully, refining the list of documents as they find necessary. 
        The final list will be shared with your editor.</span></p>
        <p>Note that there is a <span style={{"background-color" : "#FFFF00"}}>chat tool</span> you can use to communicate with your colleagues about the task and coordinate yourselves. </p>
        <p><span style={{"background-color" : "#FFFF00"}}>Documents should be collected that comply with the following criteria: </span></p>

        <strong> <font color="#33BEFF">
            <p>{description}</p>
            </font> </strong>

    </div>
);


const minerDescription = (title, description) => (
    <div>


        <p>Imagine you are a reporter for a newspaper. <span style={{"background-color" : "#FFFF00"}}>Your editor has just told you to write a story about <font color="#33BEFF"><strong>{title}</strong></font> together with a group of colleagues</span>. 
        However, before you can write the story, <span style={{"background-color" : "#FFFF00"}}> you and your colleagues need to collect in 15 minutes a number of documents that will support writing the story.</span></p>
        <p>Your group distributes the work by splitting the task into two subtasks: (1) finding useful documents and (2) examining them in detail. </p>
        <p><span style={{"background-color" : "#FFFF00"}}>Some of your colleagues will be saving documents while you look at them in details.
        Your job is to carefully examine the documents in the shared list and retain the most useful ones. You can also conduct your own searches and add documents to this shared list.</span> 
        The final list will be shared with your editor.</p>
        <p>Note that there is a <span style={{"background-color" : "#FFFF00"}}>chat tool</span> you can use to communicate with your colleagues about the task and coordinate yourselves. </p>
        <p><span style={{"background-color" : "#FFFF00"}}>Documents should be collected that comply with the following criteria: </span></p>

        <strong> <font color="#33BEFF">
            <p>{description}</p>
            </font> </strong>


     
    </div>
);


const noRolesDescription = (title, description) => (
    <div>


    <p>Imagine you are a reporter for a newspaper. 
    <span style={{"background-color" : "#FFFF00"}}>Your editor has just told you to write a story about <font color="#33BEFF"> <strong>{title}</strong></font> together with a group of colleagues</span>. 
    However, before you can write the story, <span style={{"background-color" : "#FFFF00"}}> you and your colleagues need to collect in 15 minutes a number of documents that will support writing the story.</span></p>
    <p><span style={{"background-color" : "#FFFF00"}}>Collectively, your job as a group is to work together to identify as many documents (news articles) as possible that appear on first sight to be useful (considering different aspects of <font color="#33BEFF"><strong>{title}</strong></font>), and filter them down to produce a final list of documents that you are all satisfied with. </span>
    How you work to achieve this within the group is up to you to decide. The final list will be shared with your editor. </p>
    <p>Note that there is a <span style={{"background-color" : "#FFFF00"}}>chat tool</span> you can use to communicate with your colleagues about the task and coordinate yourselves. </p>
    <p><span style={{"background-color" : "#FFFF00"}}>Documents should be collected that comply with the following criteria: </span></p>

    <strong> <font color="#33BEFF">
        <p>{description}</p>
        </font> </strong>
    </div>

);

const singleDescription = (title, description) => (
    <div>


    <p>Imagine you are a reporter for a newspaper. 
    <span style={{"background-color" : "#FFFF00"}}>Your editor has just told you to write a story about <font color="#33BEFF"> <strong>{title}</strong></font></span>. 
    However, before you can write the story, <span style={{"background-color" : "#FFFF00"}}> you need to collect in 15 minutes a number of documents that will support writing the story.</span></p>
    <p><span style={{"background-color" : "#FFFF00"}}>Your job is to identify as many documents (news articles) as possible that appear on first sight to be useful (considering different aspects of <font color="#33BEFF"><strong>{title}</strong></font>), and filter them down to produce a final list of documents that you are satisfied with. </span>
    The final list will be shared with your editor. </p>

    <p><span style={{"background-color" : "#FFFF00"}}>Documents should be collected that comply with the following criteria: </span></p>

    <strong> <font color="#33BEFF">
        <p>{description}</p>
        </font> </strong>
    </div>

);


export function getTaskDescription(role, title, description){
    if (role === "prospector") {
        return prospectorDescription(title,description);
    } else if (role === "miner") {
        return minerDescription(title, description);
    } else if (role === "none"){
        return noRolesDescription(title, description);
    } else if (role === "single") {
        return singleDescription(title, description);
    }
}