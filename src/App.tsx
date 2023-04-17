import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Routes/Home';
import Tv from './Routes/Tv';
import Search from './Routes/Search';

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path='/'>
          <Home />  
        </Route>
        <Route path='/tv'>
          <Tv />
        </Route>
        <Route path='/search'>
          <Search />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;