import React from 'react'

const practiceTaskDescription = () => (
    <div>


        <p> 
        The goal of this task is to familiarized yourself with the collaborative search system. 
        As we briefly introduced in the interactive guide, this system has a recent queries area to track down what your group has been searching for, a saved items area to save and share the products that you found interesting, and  a chat tool so you can use to communicate with your friends about the task and coordinate yourselves. 
        To get you and your friends used to our system, complete the following task in 15 minutes. </p>
        <p>Please do not use any external tool to communicate with your group:</p>

        
        <p> 
        Imagine that your university want to you and your group to find a product that can help you study from home. 
        You and your group need to find one product that the university will send to all of the students at the university. 
        You should make sure that this product is inclusive, which means that this product should be useful to all of the students at the university. 
        For instance, a purple chair is not a valid product, which the colour could exclude some students. To help you out, in a survey conducted by the university last month, some students complained about that concentrating to listen to online lectures is very difficulty. 
        The university budget for each product is <strong>$100,00</strong>. 
        Leave the final item you group decided to buy on the saved items list. 
             </p>

    </div>
);


const decisionTaskDescription = () => (
    <div>

<p>Alex and Charlie, a friends couple that you all have in common, just moved in together and they have invited your for a housewarming party. 
They have asked you to buy a product around  <strong>$50,00</strong>. </p>
<p> You don't know yet what to buy, but you should make sure that you buy a product that both like. 
You are not sure whether to give them an electronics product since Alex is a gadget nerd or to help one of them to improve their home workspace since Charlie was complaining to you recently about their work sub-optimal work from home setup. 
Perhaps, Alex would like some sports accessory given their passion towards outdoor sports. </p>
<p> Together with your friends decide what to buy to bring with to the housewarming. 
Using the search system we have provided to you find one product that you think your friend you will like.</p>
<p> Leave the final item you group decided to buy on the saved items list. 
You are in a hurry, so you only have 15 minutes to find the product to your friends.</p>     
    </div>
);



export function getTaskDescription(taskType){
    if (taskType === "practice") {
        return practiceTaskDescription();
    } else if (taskType === "decision") {
        return decisionTaskDescription();
    } 
}