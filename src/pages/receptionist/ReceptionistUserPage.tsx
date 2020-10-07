import React from "react";
import { useSelector } from "react-redux";
import {
  isLoaded,
  useFirebase,
  useFirestore,
  useFirestoreConnect,
} from "react-redux-firebase";
import { toast } from "react-toastify";
import Breadcrumbs from "../../components/custom/Breadcrumbs";
import UserManagement from "../../components/user/UserManagement";
import { ERol } from "../../models/ERol";
import { IUser } from "../../models/IUser";

const ReceptionistUserPage: React.FunctionComponent = () => {
  useFirestoreConnect([{ collection: "users" }]);
  const users: IUser[] = useSelector(
    (state: any) => state.firestore.ordered.users
  );
  const currentUser: IUser = useSelector(
    (state: any) => state.firebase.profile
  );

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

  const firestore = useFirestore().collection("users");
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
          { uri: "/receptionist-panel", text: "Panel de recepcionista" },
        ]}
        last="Usuarios"
      />
      {!isLoaded(currentUser) || !isLoaded(users) ? (
        <p className="m-2 text-center">Cargando Usuarios...</p>
      ) : (
        <UserManagement
          rol={ERol.Receptionist}
          users={users.filter((u) => {
            return currentUser.uid !== u.id;
          })}
          isFull
          onUserNameChange={onUserNameChange}
          onRestorePassword={onRestorePassword}
        />
      )}
    </>
  );
};

export default ReceptionistUserPage;
