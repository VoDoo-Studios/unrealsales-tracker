import 'array-flat-polyfill';

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
import MainPage from './pages/MainPage/mainpage';
import Tracker from './pages/TrackerPage/tracker';
import Register from './pages/Register/register';
import Login from './pages/LoginPage/login';
import Reset from './pages/ResetPasswordPage/reset'
import ExtAdd from './pages/ExtAddPage/extadd';
import Terms from './pages/TermsPage/terms';
import ChangePassword from './pages/ChangePasswordPage/changePassword';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Rehydrate currency rates that are not older than 24 hours
let parsedRates = JSON.parse(localStorage.getItem('rates'));
const rates = parsedRates && Object.keys(parsedRates)
.filter( key => {
    if (((new Date()) - (new Date(parsedRates[key].timestamp))) > (60 * 60 * 1000 * 24) ) {
        return undefined;
    }
    return parsedRates[key];
} )
.reduce( (res, key) => {
    return (res[key] = parsedRates[key], res);
}, {} );

const persistedState = {
    app: {
        userToken: localStorage.getItem('userToken'),
        currency: localStorage.getItem('currency'),
        rates: rates,
    }
};

window.tracker = {};

let store = createStore(
	unrealTracker,
    persistedState,
	composeEnhancers(applyMiddleware(thunk)),
);
// Link history API
const history = createBrowserHistory();
window.tracker.appHistory = history;

// Delegate api url
window.tracker.api_endpoint = 'https://api.unrealsales.io/prod/';
if (window.location.href.indexOf("localhost") > -1) {
    window.tracker.api_endpoint = 'https://api.unrealsales.io/dev/';
}
ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Switch>
                <Route exact path="/" component={MainPage}/>
                <Route exact path="/tracker/" component={Tracker}/>
                <Route exact path="/tracker/register" component={Register}/>
                <Route exact path="/tracker/login" component={Login}/>
                <Route exact path="/tracker/reset-password" component={Reset}/>
                <Route exact path="/tracker/change-password" component={ChangePassword}/>
                <Route exact path="/tracker/add" component={ExtAdd}/>
                <Route exact path="/tracker/terms-conditions" component={Terms}/>
            </Switch>
        </Router>
    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
