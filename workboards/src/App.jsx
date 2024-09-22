// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreateBoard from './components/CreateBoard';
import Board from './components/Board';

const App = () => {
  const isAuthenticated = useSelector((state) => !!state.auth.token);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {isAuthenticated ? <Redirect to="/dashboard" /> : <Login />}
        </Route>
        <Route path="/dashboard">
          {isAuthenticated ? <Dashboard /> : <Redirect to="/" />}
        </Route>
        <Route path="/create">
          {isAuthenticated ? <CreateBoard /> : <Redirect to="/" />}
        </Route>
        <Route path="/board/:id">
          {isAuthenticated ? <Board /> : <Redirect to="/" />}
        </Route>
      </Switch>
    </Router>
  );
};

export default App;