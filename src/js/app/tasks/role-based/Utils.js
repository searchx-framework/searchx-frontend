import React from 'react'

const prospectorDescription = (title, description) => (
    <div>


        <p> Imagine you are a reporter for a newspaper. Your editor has just told you to write a story about <font color="#33BEFF"> <strong>{title}</strong></font> together with a group of colleagues. 
        Before writing the story, your editor called for meeting, and asked you and your colleagues to collect in 10 minutes materials that will support writing the story. </p>
        <p> Your group distributes the work by splitting the task into two subtasks: (1) finding useful documents and (2) examining them in detail. </p>
        <p> Your job is to identify as many documents (news articles) as possible that appear on first sight to be useful (considering different aspects of <font color="#33BEFF"> <strong>{title}</strong> </font>)  for the task at hand. As you save the documents, they will be shared with your colleagues. Your colleagues will be examining the saved documents carefully, refining the list of documents as they find necessary. The final list will be shared with your editor during the meeting. </p>
        <p> Note that there is a chat tool you can use to communicate with your colleagues about the task at hand and coordinate your task. Collect documents according to the following criteria: </p>
        
        <strong> <font color="#33BEFF">
            <p>{description}</p>
            </font> </strong>

    </div>
);


const minerDescription = (title, description) => (
    <div>


        <p> Imagine you are a reporter for a newspaper. Your editor has just told you to write a story about <font color="#33BEFF"> <strong>{title}</strong></font> together with a group of colleagues. Before writing the story, your editor called for meeting, and asked you and your colleagues to collect in 10 minutes materials that will support writing the story. </p>
        <p>Your group distributes the work by splitting the task into two subtasks: (1) finding useful documents and (2) examining them in detail. Some of your colleagues will be saving documents while you look at them in details. </p>
        <p> Your job is to carefully examine the documents in the shared list and retain the most useful ones. You can also conduct your own searches and add documents to this shared list. The final list will be shared with your editor during the meeting. </p>
        <p>Note that there is a chat tool you can use to communicate with your colleagues about the task at hand and coordinate your task. Collect documents according to the following criteria: ROBUST05 topic description. </p>


        <strong> <font color="#33BEFF">
            <p>{description}</p>
            </font> </strong>


     
    </div>
);


const noRolesDescription = (title, description) => (
    <div>


    <p>Imagine you are a reporter for a newspaper. Your editor has just told you to write a story about <font color="#33BEFF"> <strong>{title}</strong></font> together with a group of colleagues. Before writing the story, your editor called for meeting, and asked you and your colleagues to collect in 10 minutes materials that will support writing the story. </p>
    <p>Collectively, your job as a group is to work together to identify as many documents (news articles) as possible that appear on first sight to be useful (considering different aspects of ROBUST05 topic title), and filter them down to produce a final list of documents that you are all satisfied with. How you work to achieve this within the group is up to you to decide. The final list will be shared with your editor during the meeting. </p>
    <p>Note that there is a chat tool you can use to communicate with your colleagues. </p>

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
    } else {
        noRolesDescription(title, description);
    }
}