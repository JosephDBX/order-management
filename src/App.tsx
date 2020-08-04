import React, { useEffect } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  useLocation,
  Redirect,
} from "react-router-dom";
import "./App.scss";

import { useSelector } from "react-redux";
import { isLoaded, isEmpty, useFirebase } from "react-redux-firebase";
import { IUser } from "./models/IUser";

// Components
import Toolbar from "./components/public/Toolbar";
import Footer from "./components/public/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// *************** Pages ***************
// Public Pages
import HomePage from "./pages/public/HomePage";
import SignUpPage from "./pages/public/SignUpPage";
import SignInPage from "./pages/public/SignInPage";
import Error404Page from "./pages/public/Error404Page";
import AdminPanel from "./pages/admin/AdminPanel";

function App() {
  const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  };

  const firebase = useFirebase();

  // Wait For Auth To Load
  const auth = useSelector((state: any) => state.firebase.auth);
  const currentUser: IUser = useSelector(
    (state: any) => state.firebase.profile
  );

  const AuthIsLoaded = ({ children }: any) => {
    if (!isLoaded(auth) || !isLoaded(currentUser))
      return (
        <div>
          <h4 className="m-4">Cargando, por favor espere...</h4>
          <div
            className="h-48 w-48 mx-auto"
            style={{
              background: "url('logo512.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              zoom: 2,
            }}
          ></div>
        </div>
      );
    return children;
  };

  const onCloseSession = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        toast.info("¡Sesión cerrada con éxito!");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <BrowserRouter>
      <AuthIsLoaded>
        <Toolbar
          isLogIn={
            isLoaded(currentUser) && !isEmpty(currentUser) && auth.emailVerified
          }
          onCloseSession={onCloseSession}
        />
        <ScrollToTop />
        <main className="container mt-20 mx-auto flex-grow">
          <Switch>
            {/** public routes */}
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
            <Route exact path="/home" component={HomePage} />
            {/** auth routes */}
            <Route exact path="/sign-up">
              {!isEmpty(currentUser) ? <Redirect to="/home" /> : <SignUpPage />}
            </Route>
            <Route exact path="/sign-in">
              {!isEmpty(currentUser) ? <Redirect to="/home" /> : <SignInPage />}
            </Route>
            {/** user routes */}
            <Route exact path="/user-panel" component={Error404Page} />
            {/** delivery worker routes */}
            <Route exact path="/delivery-panel" component={Error404Page} />
            {/** receptionist routes */}
            <Route exact path="/receptionist-panel" component={Error404Page} />
            {/** laboratorist routes */}
            <Route exact path="/laboratorist-panel" component={Error404Page} />
            {/** admin routes */}
            <Route exact path="/admin-panel" component={AdminPanel} />
            <Route path="*" component={Error404Page} />
          </Switch>
        </main>
        <Footer />
      </AuthIsLoaded>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
