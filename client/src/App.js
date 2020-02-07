import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Home     from './Home.js';
import Account  from './Account.js';
import Generate from './Generate.js';
import Download from './Download.js';

export default function App() {
    return (
        <Router>
            <Switch>
                <Route path="/download">
                    <Download />
                </Route>
                <Route path="/generate">
                    <Generate />
                </Route>
                <Route path="/account">
                    <Account />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </Router>
    );
}