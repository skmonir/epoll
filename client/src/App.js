import Header from './components/Header';
import Home from './components/Home';
import CreatePoll from './components/CreatePoll';
import ViewPoll from './components/ViewPoll';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Footer from './components/Footer';

function App() {
  let userService = {};

  userService.createSiteData = () => {
    let siteData = {
        'uid' : uuidv4(),
        'host' : [],
        'votes': {},
    };
    localStorage.setItem('epoll_site_data', JSON.stringify(siteData));
    return siteData;
  };

  userService.getSiteData = () => {
    let siteData = JSON.parse(localStorage.getItem('epoll_site_data'));
    if (!siteData) {
        siteData = userService.createSiteData();
    }
    return siteData;
  };

  userService.updateSiteData = (siteData) => {
    localStorage.setItem('epoll_site_data', JSON.stringify(siteData));
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Home userService={userService} />
            </Route>
            <Route path="/create">
              <CreatePoll userService={userService} />
            </Route>
            <Route path="/poll/:id">
              <ViewPoll userService={userService} />
            </Route>
            {/* <Route path="*">
              <NotFound />
            </Route> */}
          </Switch>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
