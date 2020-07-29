import React, { useEffect } from "react";
import { BrowserRouter, Switch, Route, useLocation } from "react-router-dom";
import "./App.scss";

// Components
import Toolbar from "./components/public/Toolbar";
import Footer from "./components/public/Footer";

// Pages
import HomePage from "./pages/HomePage";

function App() {
  const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  };
  return (
    <BrowserRouter>
      <Toolbar isLogIn={false} onCloseSession={function () {}} />
      <ScrollToTop />
      <main className="container mt-20 mx-auto flex-grow">
        <Switch>
          <Route
            exact
            path="/"
            component={HomePage as React.FunctionComponent}
          />
        </Switch>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
