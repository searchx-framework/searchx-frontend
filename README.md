# SearchX Frontend

SearchX is a scalable collaborative search system being developed by [Lambda Lab](http://www.wis.ewi.tudelft.nl/projects/learning-analytics/) of [TU Delft](https://www.tudelft.nl/).
It is based on [Pineapple Search](http://onlinelibrary.wiley.com/doi/10.1002/pra2.2016.14505301122/full) and is further developed to facilitate collaborative search and sensemaking.

Apart from serving the interface, the frontend also manages user data and defines the logs sent back to the backend.
It is built on NodeJS using the [React](https://reactjs.org/) + [Flux](https://facebook.github.io/flux/) framework and is served through [webpack](https://webpack.js.org/).

# Setup

- Configure SearchX backend API in `webpack.config.js`
```
externals: {
    'config': JSON.stringify(process.env.ENV === 'production' ? {
        serverUrl: "https://myserver.com"
    } : {
        serverUrl: "http://localhost:4443"
    })
}
```

- Install all dependencies:

```
// Install webpack
npm i babel webpack webpack-dev-server

// Install rest of dependencies
npm update
```

- Start the development server:

```
npm start
```

# Modifications

### Adding additional Logs
To add a new log, you should add a new log event type to `utils/LoggerEventTypes.js` 
and then call the `log` function from `utils/Logger.js` using the new event type. 
The logger will automatically add information on the current user state. 
Any action specific log data can be inserted as an argument when calling the `log` function.

### Modifying the learning task
The learning task is defined inside `app/tasks/learning`.
The forms and interface is defined in the frontend, whereas the learning topics and group creation is managed by the backend.
All form uses [surveyjs](https://surveyjs.io/Overview/Library/) and the results are sent to the backend as logs.

1. Changing task duration and type  
To change the task duration and task type, you can modify the values inside `config.js`.

2. Changing the pretest / posttest
The form questions are defined inside `app/tasks/learning/LearningPages.js` 
while the form behavior is defined inside `app/tasks/learning/forms`. 
To change the questions, you can change the `elements` inside `LearningPages.js`.

```
// EXAMPLE FORM QUESTIONS

let elements = []
let pages = []

elements.push({
    title: "How many questions?",
    name: "question-numbers",
    type: "text",
    inputType: "number",
    width: 600,
    isRequired: true
});

elements.push({
    title: "What is the question?",
    name: "question-name",
    type: "comment",
    inputType: "text",
    width: 600,
    rows: 4,
    isRequired: false
});
        
pages.push({elements:  elements});
```

### Creating a custom search task
The search interface can be found inside `app/search`, while task specific code can be found inside `app/tasks`.
If you need to extend the interface for a specific task, you should create a new component inside `app/tasks`, and then insert the search interface as a react component. 
You would then need to create a new route for the new component inside `app/App.js`.

### Adding new search interface feature
The main search interface layout can be found inside `app/search/Search.js`. 
To add a new feature to the search interface, you should a new [react component](https://reactjs.org/docs/components-and-props.html) inside `app/search/feature`, 
and then insert the new feature component inside the layout. 

```
// EXAMPLE COMPONENT

export default class NewComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            //component state
        };
    }

    render() {
        return (
            // html written using jsx
        );
    }
}
```

# License

[MIT](https://opensource.org/licenses/MIT)