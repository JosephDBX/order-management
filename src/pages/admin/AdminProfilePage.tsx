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
import { IProfileTest } from "../../models/IProfileTest";
import Breadcrumbs from "../../components/custom/Breadcrumbs";

const AdminProfilePage: React.FunctionComponent = () => {
  useFirestoreConnect([
    { collection: "profiles" },
    { collection: "profile_tests" },
  ]);
  const profiles: IProfile[] = useSelector(
    (state: any) => state.firestore.ordered.profiles
  );
  const profile_tests: IProfileTest[] = useSelector(
    (state: any) => state.firestore.ordered.profile_tests
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
      <Breadcrumbs
        navigations={[
          { uri: "/home", text: "Home" },
          { uri: "/admin-panel", text: "Panel de administrador" },
        ]}
        last="Perfiles"
      />
      {!isLoaded(profiles) || !isLoaded(profile_tests) ? (
        <p className="m-2 text-center">Cargando perfiles...</p>
      ) : (
        <ProfileManagement
          profiles={profiles}
          rol={ERol.Admin}
          profile_tests={profile_tests}
          onProfileStateChange={onProfileStateChange}
        />
      )}
    </>
  );
};

export default AdminProfilePage;
