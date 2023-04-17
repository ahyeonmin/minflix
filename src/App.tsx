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
        <Route path='/tv'>
          <Tv />
        </Route>
        <Route path='/search'>
          <Search />
        </Route>
        <Route path='/'> {/* '/' 경로는 마지막에 작성해야 정상 작동 */}
          <Home />  
        </Route>
      </Switch>
    </Router>
  );
}

export default App;