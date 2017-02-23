import { applyMiddleware, combineReducers, createStore } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';

import logger from "redux-logger"
import thunk from "redux-thunk"
import promise from "redux-promise-middleware"

import reducers from "./reducers"

const middleware = applyMiddleware(
  promise(),
  thunk,
  // logger(),
  routerMiddleware(browserHistory),
);

export default createStore(reducers, middleware)
