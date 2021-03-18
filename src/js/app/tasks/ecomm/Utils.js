import React from 'react'
import config from "../../../config";

let sharedMessage = config.interface.navigation === "shared" ? "For each search that you or any of your group members search, our system will automatically load the search results to everyone." : "";

const practiceTaskDescription = () => (
    <div>

        <p> The goal of this task is to familiarize yourself with our search system. 
        In contrast to a standard web search engine (like Google, Bing, Duckduckgo, etc.), our search system allows you to search collaboratively. 
        This means that besides search as you know it, you can also “see” what the members of your group are searching for. 
        {sharedMessage}
        As we just  introduced in the interactive guide, our system has a <em>Recent Queries</em> widget to view what your group has been searching for, a <em>Saved Items</em> widget to save and share with each other the products that you find interesting,  a <em>Chat widget</em> that you can use to communicate and coordinate among the group members, and a Shopping Basket widget to save the products that your group decided to purchase.
        </p>

        <p>In order to learn in a practical way how our system works, we first have a training task for you and your group members. 
        It should be completed within 15 minutes. Here it is: </p>

        <p>
        Imagine that your university wants you and your group members to find a product that can help you study from home. 
        You and your group members need to find one product that the university will send to all of the students at the university. 
        You should make sure that this product should be useful to all of the students at the university. 
        For instance, a purple chair is not a good choice, as this colour could annoy some students. 
        To help you out, in a survey conducted by the university last month, some students complained that concentrating during online lectures is very difficult because of noise in their student houses.  
        The university budget for each product is $100,00. One person of the group should put the final item your group decided to buy from the saved items list into the <em>Shopping Basket</em> widget. 
        </p>

        <p>
        As this task is a dedicated training task, you are encouraged to try out the various widgets of our search system. 
        There is no goal here beyond familiarizing yourself with our search system (and finding a nice product for university students!). 
        Finally, please only use our search system to interact with your group members; do not use other tools (like Discord, Whatsapp and so on) to communicate. 
        </p>

    </div>
);


const decisionTaskDescription = () => (
    <div>
    <p>
        Alex and Charlie, a young couple who are your friends, just moved in together, and they have invited your and your group members to a housewarming party. 
        Your group members have decided to buy a gift together for your friends. 
        Together, you should decide on a budget in the range of $50,00 and $200,00.  </p>
     <p>
        You don't know yet what to buy, but you should make sure that you choose a gift that both Alex and Charlie will enjoy. 
        You are not sure whether to give them an electronic product since Alex is a gadget nerd or to help one of them improve their home workspace since Charlie complained to your group recently about their sub-optimal working-from-home setup. 
        Perhaps, Alex would like some sports accessories given their passion for outdoor sports.  </p>
    <p>
        Together with your group members, decide what to buy to bring with you to the housewarming party. 
        Using our search system, find one product you think your friends will like. 
        To do so, first your group should explore a number of different products and save the ones you find good candidates to give as a gift in the <em>Saved Items</em> widget. </p>
    <p>
        After you have found a few candidates, discuss which one to settle on as the final gift to buy. One person of the group should put the final item your group decided to buy from the <em>Saved Items</em> widget to the <em>Shopping Basket</em> widget. 
        You want to buy a good gift but are also pressed for time as the party will start in an hour. You have thus 30 minutes to find a gift for your friends. 
    </p>
    </div>
);



export function getTaskDescription(taskType){
    if (taskType === "practice") {
        return practiceTaskDescription();
    } else if (taskType === "decision") {
        return decisionTaskDescription();
    } 
}