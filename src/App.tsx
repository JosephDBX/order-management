import React, { useEffect } from "react";
import { BrowserRouter, Switch, Route, useLocation } from "react-router-dom";
import "./App.scss";

// Components
import Toolbar from "./components/public/Toolbar";
import Footer from "./components/public/Footer";

// Pages
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";

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
          <Route exact path="/" component={HomePage} />
          <Route exact path="/sign-up" component={SignUpPage} />
        </Switch>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

/**
 *************** Read All ***************
useFirestoreConnect([{ collection: "users" }]);
const users: IUser[] = useSelector(
  (state: any) => state.firestore.ordered.users
);

return (
  <div>
    {!isLoaded(users) ? (
      <p>Loading...</p>
    ) : isEmpty(users) ? (
      <p>Users List is Empty.</p>
    ) : (
      <ul>
        {Object.keys(users).map((key, id) => (
          <li key={key}>{users[id].email}</li>
        ))}
      </ul>
    )}
  </div>
)

 *************** Read By Id ***************
const firestore = useFirestore().collection("users");

const user: IUser = useSelector(
  ({ firestore: { data } }: any) => data.users && data.users[id]
);

const addUser = () => {
  firestore.doc(id).set(aux, { merge: true }).then((value) => console.log(value));
};

return (
  <div>
    {!isLoaded(user) ? (
      <p>Loading...</p>
    ) : isEmpty(user) ? (
      <p>User is Empty.</p>
    ) : (
      user.email
    )}
  </div>
)
*/
