import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/dark-styles.css';
import './assets/css/color1.css';
import './index.css';
import App from './App';
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import { reducer } from './store';
const store = createStore(reducer);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
