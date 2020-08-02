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
  const AuthIsLoaded = ({ children }: any) => {
    if (!isLoaded(auth))
      return (
        <div>
          <h4 className="m-4">cargando, por favor espere...</h4>
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

  // Add Role Routes
  const currentUser: IUser = useSelector(
    (state: any) => state.firebase.profile
  );
  const PrivateRoute = () => {
    return (
      <>
        {isLoaded(currentUser) &&
        !isEmpty(currentUser) &&
        auth.emailVerified ? (
          <>
            {currentUser.roles?.isDeliveryWorker ? <>1</> : null}
            {currentUser.roles?.isDoctor ? <>2</> : null}
            {currentUser.roles?.isReceptionist ? <>3</> : null}
            {currentUser.roles?.isLaboratorist ? <>4</> : null}
            {currentUser.roles?.isAdmin ? <>5</> : null}
          </>
        ) : (
          <Redirect to="/sign-in" />
        )}
      </>
    );
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
            <Route exact path="/" component={HomePage} />
            <Route exact path="/sign-up" component={SignUpPage} />
            <Route exact path="/sign-in" component={SignInPage} />
            <PrivateRoute />
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
