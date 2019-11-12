# SearchX Front End



SearchX is a scalable collaborative search system being developed by [Lambda Lab](http://www.wis.ewi.tudelft.nl/projects/learning-analytics/) of [TU Delft](https://www.tudelft.nl/).
It is based on [Pineapple Search](http://onlinelibrary.wiley.com/doi/10.1002/pra2.2016.14505301122/full) and is further developed to facilitate collaborative search and sensemaking.

Apart from serving the interface, the front end also manages user data and defines the logs sent back to the back end.
It is built on NodeJS using the [React](https://reactjs.org/) + [Flux](https://facebook.github.io/flux/) framework and is served through [webpack](https://webpack.js.org/).

# Setup

- Make sure the [SearchX back end](https://github.com/felipemoraes/searchx-backend) is up and running.

- Set up the server and install dependencies:
    ```
    // Clone the repository
    git clone https://github.com/felipemoraes/searchx-frontend.git
    
    // Change directory to repository
    cd searchx-frontend
    
    // Install dependencies:
    npm install
    
    // Copy example configuration
    cp .env.example .env
    ```

- Start the development server:
    ```
    npm start
    
    // Now check http://localhost:8080/search
    ```
# Configuration
The main production configuration keys are can be found in your `.env` file. If the backend runs on the same server as the frontend the default values work for local access. If you want access the frontend publicly you need to set at least the `REACT_APP_PUBLIC_URL` key. The keys are:
- `PORT`: the port at which the frontend will run
- `REACT_APP_PUBLIC_URL`: the url at which the server can be accessed publicly
- `REACT_APP_SERVER_URL`: the url at which the backend server can be accessed by the frontend
- `REACT_APP_RENDERER_URL`: the url at which the renderer server can be accessed by the frontend

Configuration to customize SearchX's functionality can be found in `src/js/config.js`. This configuration can be used to toggle various features on and off, see the comments in the file for a description of the available options.

# Modifications

## Logs
To add a new log, you should add a new log event type to `utils/LoggerEventTypes.js` 
and then call the `log` function from `utils/Logger.js` using the new event type. 
The logger will automatically add information on the current user state. 
Any action specific log data can be inserted as an argument when calling the `log` function.

## Tasks
The learning task is defined inside `app/tasks/learning`.
The forms and interface is defined in the front end, whereas the learning topics and group creation is managed by the back end.
All form uses [surveyjs](https://surveyjs.io/Overview/Library/) and the results are sent to the back end as logs.

### Modifying the learning task
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

## Adding search interface features
The main search interface layout can be found inside `app/search/Search.js`. 
To add a new feature to the search interface, you should a new [react component](https://reactjs.org/docs/components-and-props.html) inside `app/search/feature`, 
and then insert the new feature component inside the layout. 

```
// EXAMPLE COMPONENT

export default class NewComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            // component data
        };
    }

    render() {
        return (
            // html written using jsx
        );
    }
}
```

## Search providers
SearchX supports multiple search providers, which provide the search results that SearchX shows to the user. The Bing and Elasticsearch providers are supported out of the box, respectively providing internet search and full text search on custom datasets.

Each provider can support one or more verticals. For example, the Bing provider provides four verticals: Web, Images, Videos and News. Verticals are shown to the user in the top menu and they can switch between verticals while retaining their current query.

### Adding a new vertical or provider
If you want to add a new vertical or provider, first the searchx-backend needs to be adapted to return the data for your result. See the [searchx-backend documentation](https://github.com/felipemoraes/searchx-backend#search-providers) for instructions on how to do this.

The new vertical or provider needs to be added to the verticalProviders mapping in `src/js/config.js`. The first level of the map contains the provider name as key, and a map as value. The second level contains the vertical name as key, and a reference to the react component that will be used to display the search result as value. You can add your own verticals and providers to this map. Every provider needs to have at least one vertical.

If you wish to add your own component to display search results, add it to `src/js/app/search/results/components/types`, and reference it in the verticalProviders map.


### Citation
--------

If you use SearchX to produce results for your scientific publication, please refer to our [SIGIR 2018](http://fmoraes.nl/documents/moraes2018sigir.pdf) paper.

    @inproceedings{putra2018searchx,
      title={SearchX: Empowering Collaborative Search Research.},
      author={Putra, Sindunuraga Rikarno and Moraes, Felipe and Hauff, Claudia},
      booktitle={SIGIR},
      pages={1265--1268},
      year={2018}
    }
    
### Publications

    @article{moraes2019impact,
      title={On the impact of group size on collaborative search effectiveness},
      author={Moraes, Felipe and Grashoff, Kilian and Hauff, Claudia},
      journal={Information Retrieval Journal},
      pages={1--23},
      year={2019},
      publisher={Springer}
    }
    
    
    @inproceedings{moraes2019node,
        title={node-indri: moving the Indri toolkit to the modern Web stack},
        author={Moraes, Felipe and Hauff, Claudia},
        booktitle={ECIR},
        pages={241--245},
        year={2019}
    }

    @inproceedings{moraes2018contrasting,
      title={Contrasting Search as a Learning Activity with Instructor-designed Learning},
      author={Moraes, Felipe and Putra, Sindunuraga Rikarno and Hauff, Claudia},
      booktitle={CIKM},
      pages={167--176},
      year={2018}
    }
    
    @inproceedings{putra2018development,
        title={On the Development of a Collaborative Search System},
        author={Putra, Sindunuraga Rikarno and Grashoff, Kilian and Moraes, Felipe and Hauff, Claudia},
        booktitle={DESIRES},
        pages={76--82},
        year={2018}
    }
    

# License

[MIT](https://opensource.org/licenses/MIT)
