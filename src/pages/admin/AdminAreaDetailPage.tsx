import React from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  useFirestore,
  useFirestoreConnect,
  isLoaded,
  isEmpty,
} from "react-redux-firebase";
import { IArea } from "../../models/IArea";
import { useSelector } from "react-redux";
import MainDetailLayout from "../../layouts/MainDetailLayout";
import AreaDetail from "../../components/area/AreaDetail";
import { ERol } from "../../models/ERol";
import TestManagement from "../../components/test/TestManagement";
import { ITest } from "../../models/ITest";
import { toast } from "react-toastify";
import Breadcrumbs from "../../components/custom/Breadcrumbs";

const AdminAreaDetailPage: React.FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const firestore = useFirestore();
  useFirestoreConnect(() => [
    { collection: "areas", doc: id },
    { collection: "tests", where: [["area", "==", id]] },
  ]);

  const currentArea: IArea = useSelector(
    ({ firestore: { data } }: any) => data.areas && data.areas[id]
  );
  const tests: ITest[] = useSelector(
    (state: any) => state.firestore.ordered.tests
  );

  const navigateToAreaManagement = () => {
    history.push("/admin-panel/areas");
  };

  const onTestStateChange = (idTest: string, state: boolean) => {
    if (!currentArea.state) {
      toast.error("¡No puede activar un examen de un área desactivada!");
    } else {
      toast.info("Procesando... por favor espere...");
      firestore
        .collection("tests")
        .doc(idTest)
        .set({ state }, { merge: true })
        .then(() => {
          toast.success(
            `¡El estado del examen: ${
              tests.find((value) => value.id === idTest)?.name
            }, ha cambiado!`
          );
        })
        .catch((error) => toast.error(error.message));
    }
  };

  return (
    <>
      {!isLoaded(currentArea) ? (
        <p className="m-2 text-center">Cargando área...</p>
      ) : isEmpty(currentArea) ? (
        <div className="flex flex-col justify-center">
          <p className="m-2 text-center font-code">
            ¡El área con id:{id}, no existe!
          </p>
          <button
            className="btn btn-secondary my-4 mx-auto"
            onClick={navigateToAreaManagement}
          >
            <span className="material-icons">arrow_back</span>Regresar a la
            gestión de áreas
          </button>
        </div>
      ) : (
        <>
          <Breadcrumbs
            navigations={[
              { uri: "/home", text: "Home" },
              { uri: "/admin-panel", text: "Panel de administrador" },
              { uri: "/admin-panel/areas", text: "Áreas" },
            ]}
            last={currentArea.name}
          />
          <MainDetailLayout
            title={`Gestionar exámenes del área: ${currentArea.name}`}
            main={
              <AreaDetail
                area={{ id, ...currentArea }}
                rol={ERol.Admin}
                isMain
              />
            }
            detail={
              <>
                {!isLoaded(tests) ? (
                  <p className="m-2 text-center">Cargando exámenes...</p>
                ) : (
                  <TestManagement
                    rol={ERol.Admin}
                    tests={tests}
                    area={{ id, ...currentArea }}
                    onTestStateChange={onTestStateChange}
                  />
                )}
              </>
            }
          />
        </>
      )}
    </>
  );
};

export default AdminAreaDetailPage;
