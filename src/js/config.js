module.exports = {
    forumSnippetLength: 100, /* number of characters at which '...' replaces further content in forum bodies */
    aboutPrefixAt: 1000, /* at how many search results do we start saying 'About X results' vs. 'X results' */
    logTimeInterval: 5000,

    completionURL: "https://www.prolific.ac/submissions/complete?cc=DT3Q2IVP", /* url for completion of deployed prolific study */
    groupTimeout: 20, /* wait time for collaborative learning (minutes) */

    collaborative: true,
    taskType: 'search',
    taskDuration: 20
};
