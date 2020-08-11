import React from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  useFirestore,
  useFirestoreConnect,
  isLoaded,
  isEmpty,
} from "react-redux-firebase";
import { IProfile } from "../../models/IProfile";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ProfileEdit from "../../components/profile/ProfileEdit";

const AdminProfileEditPage: React.FunctionComponent = () => {
  const { id } = useParams();
  const history = useHistory();
  const firestore = useFirestore();
  useFirestoreConnect(() => [{ collection: "profiles", doc: id }]);

  const currentProfile: IProfile = useSelector(
    ({ firestore: { data } }: any) => data.profiles && data.profiles[id]
  );

  const navigateToProfileManagement = () => {
    history.push("/admin-panel/profiles");
  };

  const onEditProfile = (profile: IProfile) => {
    toast.info("Procesando... por favor espere...");
    firestore
      .collection("profiles")
      .doc(id)
      .set(profile, { merge: true })
      .then(() => {
        toast.success(`Perfil con id:${id}, actualizado exitosamente`);
        history.push(`/admin-panel/profiles/${id}`);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  return (
    <>
      {!isLoaded(currentProfile) ? (
        <p className="m-2 text-center">Cargando perfil...</p>
      ) : isEmpty(currentProfile) ? (
        <div className="flex flex-col justify-center">
          <p className="m-2 text-center font-code">
            ¡El perfil que está intentando editar no existe!
          </p>
          <button
            className="btn btn-secondary my-4 mx-auto"
            onClick={navigateToProfileManagement}
          >
            <span className="material-icons">arrow_back</span>Regresar a la
            gestión de perfiles
          </button>
        </div>
      ) : (
        <ProfileEdit
          currentProfile={currentProfile}
          onEditProfile={onEditProfile}
        />
      )}
    </>
  );
};

export default AdminProfileEditPage;
