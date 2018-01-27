import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/scale.css';

const app = (
    <div>
        <App />
        <Alert stack={{limit: 3}} />
    </div>
);

ReactDOM.render(app, document.getElementById('main'));