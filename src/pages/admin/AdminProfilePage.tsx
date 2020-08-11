import React from "react";
import {
  useFirestoreConnect,
  useFirestore,
  isLoaded,
} from "react-redux-firebase";
import { IProfile } from "../../models/IProfile";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ProfileManagement from "../../components/profile/ProfileManagement";
import { ERol } from "../../models/ERol";

const AdminProfilePage: React.FunctionComponent = () => {
  useFirestoreConnect([{ collection: "profiles" }]);
  const profiles: IProfile[] = useSelector(
    (state: any) => state.firestore.ordered.profiles
  );

  const firestore = useFirestore().collection("profiles");
  const onProfileStateChange = (id: string, state: boolean) => {
    toast.info("Procesando... por favor espere...");
    firestore
      .doc(id)
      .set({ state }, { merge: true })
      .then(() => {
        toast.success(
          `¡El estado del perfil: ${
            profiles.find((value) => value.id === id)?.name
          }, ha cambiado!`
        );
      })
      .catch((error) => toast.error(error.message));
  };

  return (
    <>
      {!isLoaded(profiles) ? (
        <p className="m-2 text-center">Cargando perfiles...</p>
      ) : (
        <ProfileManagement
          profiles={profiles}
          rol={ERol.Admin}
          onProfileStateChange={onProfileStateChange}
        />
      )}
    </>
  );
};

export default AdminProfilePage;
