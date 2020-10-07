import React, { useState } from "react";
import { IArea } from "../../models/IArea";
import AreaEdit from "../../components/area/AreaEdit";
import { useHistory, useParams } from "react-router-dom";
import {
  useFirestore,
  isLoaded,
  isEmpty,
  useFirestoreConnect,
} from "react-redux-firebase";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../components/custom/Loading";
import Breadcrumbs from "../../components/custom/Breadcrumbs";

const AdminAreaEditPage: React.FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const firestore = useFirestore();

  const [isLoading, setIsLoading] = useState(false);

  useFirestoreConnect(() => [{ collection: "areas", doc: id }]);

  const currentArea: IArea = useSelector(
    ({ firestore: { data } }: any) => data.areas && data.areas[id]
  );

  const navigateToAreaManagement = () => {
    history.push("/admin-panel/areas");
  };

  const onEditArea = (area: IArea) => {
    setIsLoading(true);
    toast.info("Procesando... por favor espere...");
    firestore
      .collection("areas")
      .doc(id)
      .set(area, { merge: true })
      .then(() => {
        toast.success(`Área con id:${id}, actualizada exitosamente`);
        history.push(`/admin-panel/areas/${id}`);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message);
      });
  };

  return (
    <>
      <Breadcrumbs
        navigations={[
          { uri: "/home", text: "Home" },
          { uri: "/admin-panel", text: "Panel de administrador" },
          { uri: "/admin-panel/areas", text: "Áreas" },
        ]}
        last="Editar área"
      />
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
        <AreaEdit currentArea={currentArea} onEditArea={onEditArea} />
      )}
      <Loading isLoading={isLoading} />
    </>
  );
};

export default AdminAreaEditPage;
