import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router,Switch,Route,withRouter} from 'react-router-dom'
import Room from './Room'
ReactDOM.render(
  <Router>
    <Switch>
    <Route exact path="/room/:name" component= {Room}></Route>
    <Route exact path="/" component={App}></Route>
    </Switch>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();