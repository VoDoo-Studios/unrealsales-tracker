import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux'
import { createStore, compose, applyMiddleware } from 'redux';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk';
import * as serviceWorker from './serviceWorker';

import unrealTracker from './reducers/';

import './index.css';
import App from './pages/MainPage/app';
import Register from './pages/Register/register';
import Login from './pages/LoginPage/login';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistedLogin = localStorage.getItem('userToken') ? {app: {userToken: localStorage.getItem('userToken')}} : {}

window.tracker = {};

let store = createStore(
	unrealTracker,
    persistedLogin,
	composeEnhancers(applyMiddleware(thunk)),
);
// Link history API
const history = createBrowserHistory();
window.tracker.appHistory = history;

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Switch>
                <Route exact path="/tracker/" component={App}/>
                <Route exact path="/tracker/register" component={Register}/>
                <Route exact path="/tracker/login" component={Login}/>
            </Switch>
        </Router>
    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
