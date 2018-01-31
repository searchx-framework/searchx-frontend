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
TODO

### Customize search task
TODO

# License

[MIT](https://opensource.org/licenses/MIT)`