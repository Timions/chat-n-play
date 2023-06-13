import { BrowserRouter as Router } from "react-router-dom";
import { Switch, Route } from 'react-router';
import SocketContext, { socket } from "../../services/socket";

import './App.css';

import '../../fonts/coffeeteademo.woff';
import '../../fonts/coffee+teademo-Regular.ttf';
import '../../fonts/Calibri-Regular.woff';
import '../../fonts/Calibri-Regular.ttf';

import Home from '../Home/Home';
import Invitation from '../Invitation/Invitation';
import GameBase from '../GameBase/GameBase';
import PageNotFound from '../PageNotFound/PageNotFound';
import AboutUs from "../Footer/AboutUs/AboutUs";
import FAQ from "../Footer/FAQ/FAQ";
import PrivacyPolicy from "../Footer/PrivacyPolicy/PrivacyPolicy";

function App() {
  return (
    <SocketContext.Provider value={ socket }>
      <Router>
        <Switch>
          <Route path='/' exact render={ () => <Home /> } />
          <Route path='/invitation/:roomid' exact render={ ({match}) => <Invitation match={ match } /> } />
          <Route path='/game' render={ ({match}) => <GameBase match={ match } /> } />
          <Route path='/aboutus' exact render={ () => <AboutUs/> } />
          <Route path='/faq' exact render={ () => <FAQ/> } />
          <Route path='/privacypolicy' exact render={ () => <PrivacyPolicy/> } />
          <Route render={ () => <PageNotFound /> } />
        </Switch>
      </Router>
    </SocketContext.Provider>
  );
}

export default App;
