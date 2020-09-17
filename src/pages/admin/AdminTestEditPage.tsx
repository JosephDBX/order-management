import React, { useState } from "react";
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
import TestEdit from "../../components/test/TestEdit";
import Loading from "../../components/custom/Loading";

const AdminTestEditPage: React.FunctionComponent = () => {
  const { idArea, idTest } = useParams<{ idArea: string; idTest: string }>();
  const history = useHistory();
  const firestore = useFirestore();

  const [isLoading, setIsLoading] = useState(false);

  useFirestoreConnect(() => [
    { collection: "areas", doc: idArea },
    { collection: "tests", doc: idTest },
  ]);

  const currentArea: IArea = useSelector(
    ({ firestore: { data } }: any) => data.areas && data.areas[idArea]
  );
  const currentTest: ITest = useSelector(
    ({ firestore: { data } }: any) => data.tests && data.tests[idTest]
  );

  const navigateToAreaManagement = () => {
    history.push("/admin-panel/areas");
  };
  const navigateToCurrentArea = () => {
    history.push(`/admin-panel/areas/${idArea}`);
  };

  const onEditTest = (test: ITest) => {
    setIsLoading(true);
    toast.info("Procesando... por favor espere...");
    firestore
      .collection("tests")
      .doc(idTest)
      .set(test, { merge: true })
      .then(() => {
        toast.success(`Examen con id:${idTest}, actualizado exitosamente`);
        navigateToCurrentArea();
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message);
      });
  };

  return (
    <>
      {!isLoaded(currentArea) || !isLoaded(currentTest) ? (
        <p className="m-2 text-center">Cargando...</p>
      ) : isEmpty(currentArea) || isEmpty(currentTest) ? (
        <div className="flex flex-col justify-center">
          <p className="m-2 text-center font-code">
            ¡El examen con id:{idTest}, no existe en el área con id: {idArea}
          </p>
          {isEmpty(currentArea) ? (
            <button
              className="btn btn-secondary my-4 mx-auto"
              onClick={navigateToAreaManagement}
            >
              <span className="material-icons">arrow_back</span>Regresar a la
              gestión de áreas
            </button>
          ) : (
            <button
              className="btn btn-secondary my-4 mx-auto"
              onClick={navigateToCurrentArea}
            >
              <span className="material-icons">arrow_back</span>Regresar a la
              gestión del área {currentArea.name}
            </button>
          )}
        </div>
      ) : (
        <TestEdit
          onEditTest={onEditTest}
          currentArea={{ id: idArea, ...currentArea }}
          currentTest={{ id: idTest, ...currentTest }}
        />
      )}
      <Loading isLoading={isLoading} />
    </>
  );
};

export default AdminTestEditPage;
