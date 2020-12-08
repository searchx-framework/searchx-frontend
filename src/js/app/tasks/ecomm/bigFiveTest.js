export default [
    {
        type: "html",
            html: `
            <p>Describe yourself as you generally are now, not as you wish to be in the future.</p> 
            <p>Here are a number of characteristics that may or may not apply to you. For example, do you agree
            that you are someone who likes to spend time with others? Slect a number next to each
            statement to indicate the extent to which you agree or disagree with that statement </p>
            
       
`
    },

    {
        title: "I see Myself as Someone Who...",
        name: "big-five",
        type: "matrix",
        isRequired: true,
        isAllRowRequired: true,

        columns: [
            {
                value: 1,
                text: "Strongly Disagree"
            }, {
                value: 2,
                text: "Disagree"
            }, {
                value: 3,
                text: "Somewhat Disagree"
            }, {
                value: 4,
                text: "Neither Agree or Disagree"
            }, {
                value: 5,
                text: "Somewhat Agree"
            },
            {
                value: 6,
                text: "Agree"
            },
            {
                value: 7,
                text: "Strongly Agree"
            }
        ],
        rows: [
            {value: "1",

            text: "Is talkative"},
            
            {value: "2",
            
            text: "Tends to find fault with others "},
            
            {value: "3",
            
            text: " Does a thorough job"},
            
            {value: "4",
            
            text: "Is depressed, blue"},
            
            {value: "5",
            
            text: "Is original, comes up with new ideas"},
            
            {value: "6",
            text: "Is reserved"},
            
            {value: "7",
            
            text: "Is helpful and unselfish with others"},
            
            {value: "8",
            
            text: "Can be somewhat careless"},
            {value: "9",
            
            text: "Is relaxed, handles stress well "},
            
            {value: "10",
            
            text: "Is curious about many different things"},
            
            {value: "11",
            
            text: "Is full of energy"},
            
            {value: "12",
            
            text: "Starts quarrels with other"},
            
            {value: "13",
            
            text: "Is a reliable worker"},
            
            {value: "14",
            
            text: "Can be tense"},
            
            {value: "15",
            
            text: "Is ingenious, a deep thinker"},
            
            {value: "16",
            
            text: "Generates a lot of enthusiasm"},
            
            {value: "17",
            
            text: "Has a forgiving nature"},
            
            {value: "18",
            
            text: "Tends to be disorganized"},
            
            {value: "19",
            text: "Worries a lot"},

            {value: "C-1",
            
            text: "This is a control option, select Strongly Disagree"},

            {value: "20",
            
            text: "Has an active imagination"},
            
            {value: "21",
            
            text: "Tends to be quiet"},
            
            {value: "22",
            
            text: "Is generally trusting"},
            
            {value: "23",
            
            text: "Tends to be lazy"},
            
            {value: "24",
            
            text: "Is emotionally stable, not easily upset"},
            
            {value: "25",
            
            text: "Is inventive"},
            
            {value: "26",
            
            text: "Has an assertive personality"},
            
            {value: "27",
            
            text: "Can be cold and aloof"},
            
            {value: "28",
            
            text: "Perseveres until the task is finished"},
            
            {value: "29",
            
            text: "Can be moody"},

            {value: "C-2",
            
            text: "This is a control option, select Agree"},

            
            {value: "30",
            
            text: "Values artistic, aesthetic experiences"},
            
            {value: "31",
            
            text: "Is sometimes shy, inhibited"},
            
            {value: "32",
            
            text: "Is considerate and kind to almost everyone"},
            
            {value: "33",
            
            text: "Does things efficiently"},
            
            {value: "34",
            
            text: "Remains calm in tense situations"},
            
            {value: "35",
            
            text: "Prefers work that is routine"},
            
            {value: "36",
            
            text: "Is outgoing, sociable"},
            
            {value: "37",
            
            text: "Is sometimes rude to others"},
            
            {value: "38",
            
            text: "Makes plans and follows through with them"},
            
            {value: "39",
            
            text: "Gets nervous easily"},
            
            {value: "40",
            
            text: "Likes to reflect, play with ideas"},

            {value: "C-3",
            
            text: "This is a control option, select Somewhat Agree"},
            
            {value: "41",
            
            text: "Has few artistic interests"},
            
            {value: "42",
            
            text: " Likes to cooperate with others"},
            
            {value: "43",
            
            text: "Is easily distracted"},
            
            {value: "44",
            
            text: "Is sophisticated in art, music, or literature"}
    ]
}]