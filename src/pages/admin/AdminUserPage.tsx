import React from "react";
import {
  useFirestoreConnect,
  useFirestore,
  isLoaded,
} from "react-redux-firebase";
import { IUser, IRole } from "../../models/IUser";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import MainDetailLayout from "../../layouts/MainDetailLayout";
import { ERol } from "../../models/ERol";
import UserDetail from "../../components/user/UserDetail";
import UserManagement from "../../components/user/UserManagement";

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
  return (
    <>
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
              onUserStateChange={onUserStateChange}
            />
          }
          detail={
            <UserManagement
              rol={ERol.Admin}
              users={users.filter((u) => {
                return currentUser.uid !== u.id;
              })}
              onUserStateChange={onUserStateChange}
            />
          }
        />
      )}
    </>
  );
};

export default AdminUserPage;
