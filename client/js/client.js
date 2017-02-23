import React from "react"
import ReactDOM from "react-dom"
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from "react-redux"

import "../styles/base"

import Titles from "./components/Titles"
import App from "./components/App"
import Viewer from "./components/Viewer"
import NotFound from "./container/NotFound"
import store from "./store"


const app = document.getElementById('app');

window.store = store;

const history = syncHistoryWithStore(browserHistory, store);
const routes = {
  path: '/',
  component: App,
  indexRoute: { component: Titles },
  childRoutes: [
    { path: '/projects/:id', component: Viewer },
    { path: '*', component: NotFound, status: 404}
  ]
};

class Root extends React.Component {
  render() {
    return (
    <Provider store={store}>
      <Router routes={routes} history={history} />
    </Provider>
    )
  }
}

ReactDOM.render(<Root />, app);

if (module.hot) {
  module.hot.accept();
}

