import React, { useState } from "react";
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
import Loading from "../../components/custom/Loading";
import Breadcrumbs from "../../components/custom/Breadcrumbs";

const AdminProfileCreatePage: React.FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
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
              cost: Number.parseFloat(tests[i].cost.toString()),
            };
            await firestore
              .collection("profile_tests")
              .doc(`${result.id}_${tests[i].id}`)
              .set(profile_test)
              .then(() =>
                toast.success(`Examen "${tests[i].name}" agregado al perfil`)
              );
          }
          history.push(`/admin-panel/profiles/${result.id}`);
        })
        .catch((error) => {
          setIsLoading(false);
          toast.error(error.message);
        });
    } else {
      toast.info("Tienes que seleccionar al menos un examen");
    }
  };

  return (
    <>
      <Breadcrumbs
        navigations={[
          { uri: "/home", text: "Home" },
          { uri: "/admin-panel", text: "Panel de administrador" },
          { uri: "/admin-panel/profiles", text: "Perfiles" },
        ]}
        last="Crear perfil"
      />
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
      <Loading isLoading={isLoading} />
    </>
  );
};

export default AdminProfileCreatePage;
