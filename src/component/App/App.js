import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

// PAGE COMPONENTS
import navConfig from '../../modules/nav.config';

// COMPONENTS
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

function App() {
  // Uses navConfig array to create all of the page components as registered pages
  const pageRoutes = navConfig.map((navData, index) => {
    const PageComponent = navData.comp;

    if (navData.exact) {
      return (
        <Route
          // Route specific attributes from navConfig
          exact
          path={navData.path}
          key={index}
        >
          <PageComponent />
        </Route>
      );
    }

    return (
      <Route
        // Route specific attributes from navConfig
        path={navData.path}
        key={index}
      >
        <PageComponent />
      </Route>
    );
  });

  return (
    <Router>
      <Switch>
        <div className="site">
          <div className="site-hd">
            <Header />
          </div>

          <main className="site-bd">{pageRoutes}</main>

          <div className="site-ft">
            <Footer />
          </div>
        </div>
      </Switch>
    </Router>
  );
}

export default App;
