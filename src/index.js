import React from 'react'
import { render } from 'react-dom'
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

// core components
import Admin from "./layouts/Admin.jsx";
import RTL from "./layouts/RTL.jsx";

import "./assets/css/material-dashboard-react.css";

const hist = createBrowserHistory();

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div')

root.id = 'root'
document.body.appendChild(root)

// Now we can render our application into it
render(
  <Router history={hist}>
    <Switch>
      <Route path="/admin" component={Admin} />
      <Route path="/rtl" component={RTL} />
      <Redirect from="/" to="/admin/docker-form" />
    </Switch>
  </Router>
  , document.getElementById('root')
)
