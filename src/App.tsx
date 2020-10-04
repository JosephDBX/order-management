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
import { ERol } from "./models/ERol";
import AdminAreaPage from "./pages/admin/AdminAreaPage";
import AdminAreaCreatePage from "./pages/admin/AdminAreaCreatePage";
import AdminAreaEditPage from "./pages/admin/AdminAreaEditPage";
import AdminAreaDetailPage from "./pages/admin/AdminAreaDetailPage";
import AdminTestCreatePage from "./pages/admin/AdminTestCreatePage";
import AdminTestEditPage from "./pages/admin/AdminTestEditPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import AdminProfileCreatePage from "./pages/admin/AdminProfileCreatePage";
import AdminProfileEditPage from "./pages/admin/AdminProfileEditPage";
import AdminProfileDetailPage from "./pages/admin/AdminProfileDetailPage";
import AdminUserPage from "./pages/admin/AdminUserPage";
import PatientPanel from "./pages/patient/PatientPanel";
import PatientCreatePage from "./pages/patient/PatientCreatePage";
import PatientDetailPage from "./pages/patient/PatientDetailPage";
import PatientEditPage from "./pages/patient/PatientEditPage";
import PatientOrderCreatePage from "./pages/patient/PatientOrderCreatePage";
import PatientOrderEditPage from "./pages/patient/PatientOrderEditPage";
import SearchPage from "./pages/public/SearchPage";
import ReceptionistPanel from "./pages/receptionist/ReceptionistPanel";
import ReceptionistUserPage from "./pages/receptionist/ReceptionistUserPage";
import ReceptionistPatientPage from "./pages/receptionist/ReceptionistPatientPage";
import ReceptionistPatientCreatePage from "./pages/receptionist/ReceptionistPatientCreatePage";
import ReceptionistPatientDetailPage from "./pages/receptionist/ReceptionistPatientDetailPage";
import ReceptionistPatientEditPage from "./pages/receptionist/ReceptionistPatientEditPage";

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
              background: "url('/logo512.png')",
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

  // Redirect
  const RedirectAdmin = (page: any, rol: ERol) => {
    if (!isEmpty(currentUser)) {
      switch (rol) {
        case ERol.DeliveryWorker: {
          if (currentUser.roles?.isDeliveryWorker) return page;
          break;
        }
        case ERol.Receptionist: {
          if (currentUser.roles?.isReceptionist) return page;
          break;
        }
        case ERol.Laboratorist: {
          if (currentUser.roles?.isLaboratorist) return page;
          break;
        }
        case ERol.Admin: {
          if (currentUser.roles?.isAdmin) return page;
          break;
        }
      }
      return <Redirect to="/home" />;
    } else {
      return <Redirect to="/sign-in" />;
    }
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
            <Route exact path="/search" component={SearchPage} />
            {/** user routes */}
            <Route exact path="/user-panel">
              {isEmpty(currentUser) ? (
                <Redirect to="/sign-in" />
              ) : (
                <PatientPanel />
              )}
            </Route>
            <Route exact path="/user-panel/patients/create">
              {isEmpty(currentUser) ? (
                <Redirect to="/sign-in" />
              ) : (
                <PatientCreatePage />
              )}
            </Route>
            <Route exact path="/user-panel/patients/:id">
              {isEmpty(currentUser) ? (
                <Redirect to="/sign-in" />
              ) : (
                <PatientDetailPage />
              )}
            </Route>
            <Route exact path="/user-panel/patients/:id/edit">
              {isEmpty(currentUser) ? (
                <Redirect to="/sign-in" />
              ) : (
                <PatientEditPage />
              )}
            </Route>
            <Route exact path="/user-panel/patients/:id/orders/create">
              {isEmpty(currentUser) ? (
                <Redirect to="/sign-in" />
              ) : (
                <PatientOrderCreatePage />
              )}
            </Route>
            <Route
              exact
              path="/user-panel/patients/:idPatient/orders/:idOrder/edit"
            >
              {isEmpty(currentUser) ? (
                <Redirect to="/sign-in" />
              ) : (
                <PatientOrderEditPage />
              )}
            </Route>
            {/** delivery worker routes */}
            <Route exact path="/delivery-panel" component={Error404Page} />
            {/** receptionist routes */}
            <Route exact path="/receptionist-panel">
              {RedirectAdmin(<ReceptionistPanel />, ERol.Receptionist)}
            </Route>
            <Route exact path="/receptionist-panel/users">
              {RedirectAdmin(<ReceptionistUserPage />, ERol.Receptionist)}
            </Route>
            <Route exact path="/receptionist-panel/users/:id">
              {RedirectAdmin(<ReceptionistPatientPage />, ERol.Receptionist)}
            </Route>
            <Route exact path="/receptionist-panel/users/:id/patients/create">
              {RedirectAdmin(
                <ReceptionistPatientCreatePage />,
                ERol.Receptionist
              )}
            </Route>
            <Route exact path="/receptionist-panel/patients">
              {RedirectAdmin(<ReceptionistPatientPage />, ERol.Receptionist)}
            </Route>
            <Route exact path="/receptionist-panel/patients/create">
              {RedirectAdmin(
                <ReceptionistPatientCreatePage />,
                ERol.Receptionist
              )}
            </Route>
            <Route exact path="/receptionist-panel/patients/:id">
              {RedirectAdmin(
                <ReceptionistPatientDetailPage />,
                ERol.Receptionist
              )}
            </Route>
            <Route exact path="/receptionist-panel/patients/:id/edit">
              {RedirectAdmin(
                <ReceptionistPatientEditPage />,
                ERol.Receptionist
              )}
            </Route>
            {/** laboratorist routes */}
            <Route exact path="/laboratorist-panel" component={Error404Page} />
            {/** admin routes */}
            <Route exact path="/admin-panel">
              {RedirectAdmin(<AdminPanel />, ERol.Admin)}
            </Route>
            <Route exact path="/admin-panel/areas">
              {RedirectAdmin(<AdminAreaPage />, ERol.Admin)}
            </Route>
            <Route exact path="/admin-panel/areas/create">
              {RedirectAdmin(<AdminAreaCreatePage />, ERol.Admin)}
            </Route>
            <Route exact path="/admin-panel/areas/:id">
              {RedirectAdmin(<AdminAreaDetailPage />, ERol.Admin)}
            </Route>
            <Route exact path="/admin-panel/areas/:id/edit">
              {RedirectAdmin(<AdminAreaEditPage />, ERol.Admin)}
            </Route>
            <Route exact path="/admin-panel/areas/:id/tests/create">
              {RedirectAdmin(<AdminTestCreatePage />, ERol.Admin)}
            </Route>
            <Route exact path="/admin-panel/areas/:idArea/tests/:idTest/edit">
              {RedirectAdmin(<AdminTestEditPage />, ERol.Admin)}
            </Route>
            <Route exact path="/admin-panel/profiles">
              {RedirectAdmin(<AdminProfilePage />, ERol.Admin)}
            </Route>
            <Route exact path="/admin-panel/profiles/create">
              {RedirectAdmin(<AdminProfileCreatePage />, ERol.Admin)}
            </Route>
            <Route exact path="/admin-panel/profiles/:id">
              {RedirectAdmin(<AdminProfileDetailPage />, ERol.Admin)}
            </Route>
            <Route exact path="/admin-panel/profiles/:id/edit">
              {RedirectAdmin(<AdminProfileEditPage />, ERol.Admin)}
            </Route>
            <Route exact path="/admin-panel/users">
              {RedirectAdmin(<AdminUserPage />, ERol.Admin)}
            </Route>
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
