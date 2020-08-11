import React from "react";
import {
  useFirestore,
  useFirestoreConnect,
  isLoaded,
  isEmpty,
} from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import { IProfile } from "../../models/IProfile";
import { toast } from "react-toastify";
import ProfileCreate from "../../components/profile/ProfileCreate";
import { ITest } from "../../models/ITest";
import { useSelector } from "react-redux";

const AdminProfileCreatePage: React.FunctionComponent = () => {
  useFirestoreConnect([{ collection: "tests" }]);
  const tests: ITest[] = useSelector(
    (state: any) => state.firestore.ordered.tests
  );

  const history = useHistory();
  const navigateToProfileManagement = () => {
    history.push("/admin-panel/profiles");
  };

  const firestore = useFirestore();
  const onCreateProfile = (profile: IProfile) => {
    toast.info("Procesando... por favor espere...");
    firestore
      .collection("profiles")
      .add(profile)
      .then((result) => {
        toast.success(`Nuevo perfil de examen creada con id:${result.id}`);
        history.push(`/admin-panel/profiles/${result.id}`);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <>
      {!isLoaded(tests) ? (
        <p className="m-2 text-center">Cargando exámenes...</p>
      ) : isEmpty(tests) ? (
        <div className="flex flex-col justify-center">
          <p className="m-2 text-center font-code">
            ¡No puede crear un perfil si aún no existen exámenes!
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
        <ProfileCreate tests={tests} onCreateProfile={onCreateProfile} />
      )}
    </>
  );
};

export default AdminProfileCreatePage;
