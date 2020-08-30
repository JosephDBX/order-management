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
import { IProfileTest } from "../../models/IProfileTest";

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
  const onCreateProfile = (profile: IProfile, tests: ITest[]) => {
    if (tests.length > 0) {
      toast.info("Procesando... por favor espere...");
      firestore
        .collection("profiles")
        .add(profile)
        .then(async (result) => {
          toast.success(`Nuevo perfil de examen creada con id:${result.id}`);
          for (let i = 0; i < tests.length; i++) {
            const profile_test: IProfileTest = {
              profile: result.id,
              test: tests[i].id as string,
              state: tests[i].state,
              cost: tests[i].cost,
            };
            await firestore
              .collection("profile_tests")
              .doc(`${result.id}_${tests[i].id}`)
              .set(profile_test)
              .then((pt) =>
                toast.success(`Examen "${tests[i].name}" agregado al perfil`)
              );
          }
          history.push(`/admin-panel/profiles/${result.id}`);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } else {
      toast.info("Tienes que seleccionar al menos un examen");
    }
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
