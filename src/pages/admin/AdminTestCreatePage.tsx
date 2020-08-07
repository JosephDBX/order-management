import React from "react";
import TestCreate from "../../components/test/TestCreate";
import { useParams, useHistory } from "react-router-dom";
import {
  useFirestore,
  useFirestoreConnect,
  isLoaded,
  isEmpty,
} from "react-redux-firebase";
import { IArea } from "../../models/IArea";
import { useSelector } from "react-redux";
import { ITest } from "../../models/ITest";
import { toast } from "react-toastify";

const AdminTestCreatePage: React.FunctionComponent = () => {
  const { id } = useParams();
  const history = useHistory();
  const firestore = useFirestore();

  useFirestoreConnect(() => [{ collection: "areas", doc: id }]);

  const currentArea: IArea = useSelector(
    ({ firestore: { data } }: any) => data.areas && data.areas[id]
  );

  const navigateToAreaManagement = () => {
    history.push("/admin-panel/areas");
  };

  const onCreateTest = (test: ITest) => {
    toast.info("Procesando... por favor espere...");
    firestore
      .collection("tests")
      .add(test)
      .then((result) => {
        toast.success(`Nuevo examen creada con id:${result.id}`);
        history.push(`/admin-panel/areas/${id}`);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <>
      {!isLoaded(currentArea) ? (
        <p className="m-2 text-center">Cargando...</p>
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
        <TestCreate onCreateTest={onCreateTest} area={{ id, ...currentArea }} />
      )}
    </>
  );
};

export default AdminTestCreatePage;
