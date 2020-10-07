import React from "react";
import {
  useFirestoreConnect,
  useFirestore,
  isLoaded,
  useFirebase,
} from "react-redux-firebase";
import { IUser, IRole } from "../../models/IUser";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import MainDetailLayout from "../../layouts/MainDetailLayout";
import { ERol } from "../../models/ERol";
import UserDetail from "../../components/user/UserDetail";
import UserManagement from "../../components/user/UserManagement";
import Breadcrumbs from "../../components/custom/Breadcrumbs";

const AdminUserPage: React.FunctionComponent = () => {
  useFirestoreConnect([{ collection: "users" }]);
  const users: IUser[] = useSelector(
    (state: any) => state.firestore.ordered.users
  );
  const currentUser: IUser = useSelector(
    (state: any) => state.firebase.profile
  );

  const firestore = useFirestore().collection("users");
  const onUserStateChange = (id: string, roles: IRole) => {
    toast.info("Procesando... por favor espere...");
    firestore
      .doc(id)
      .set({ roles }, { merge: true })
      .then(() => {
        toast.success(
          `¡Los accesos del usuario con email: ${
            users.find((value) => value.id === id)?.email
          }, han cambiado!`
        );
      })
      .catch((error) => toast.error(error.message));
  };

  const firebase = useFirebase();
  const onRestorePassword = (email: string) => {
    toast.info("Procesando... por favor espere...");
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        toast.success(
          `Se ha enviado un correo electrónico a "${email}", de restablecimiento de contraseña.`
        );
      })
      .catch((error) => {
        toast.error(error.messsage);
      });
  };

  const onUserNameChange = (id: string, userName: string) => {
    toast.info("Procesando... por favor espere...");
    firestore
      .doc(id)
      .set({ userName: userName }, { merge: true })
      .then(() => {
        toast.success(
          `¡el nombre del usuario con email: ${
            users.find((value) => value.id === id)?.email
          }, ha cambiado!`
        );
      })
      .catch((error) => toast.error(error.message));
  };

  return (
    <>
      <Breadcrumbs
        navigations={[
          { uri: "/home", text: "Home" },
          { uri: "/admin-panel", text: "Panel de administrador" },
        ]}
        last="Usuarios"
      />
      {!isLoaded(currentUser) || !isLoaded(users) ? (
        <p className="m-2 text-center">Cargando Usuarios...</p>
      ) : (
        <MainDetailLayout
          title="Gestionar los accesos de los usuarios del sistema"
          main={
            <UserDetail
              user={currentUser}
              rol={ERol.Admin}
              isMain
              onUserNameChange={onUserNameChange}
              onUserStateChange={onUserStateChange}
              onRestorePassword={onRestorePassword}
            />
          }
          detail={
            <UserManagement
              rol={ERol.Admin}
              users={users.filter((u) => {
                return currentUser.uid !== u.id;
              })}
              onUserNameChange={onUserNameChange}
              onUserStateChange={onUserStateChange}
              onRestorePassword={onRestorePassword}
            />
          }
        />
      )}
    </>
  );
};

export default AdminUserPage;
