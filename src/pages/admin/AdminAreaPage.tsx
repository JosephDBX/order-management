import React from "react";
import AreaManagement from "../../components/area/AreaManagement";
import { ERol } from "../../models/ERol";
import {
  useFirestoreConnect,
  isLoaded,
  useFirestore,
} from "react-redux-firebase";
import { IArea } from "../../models/IArea";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AdminAreaPage: React.FunctionComponent = () => {
  useFirestoreConnect([{ collection: "areas" }]);
  const areas: IArea[] = useSelector(
    (state: any) => state.firestore.ordered.areas
  );

  const firestore = useFirestore().collection("areas");
  const onAreaStateChange = (id: string, state: boolean) => {
    toast.info("Procesando... por favor espere...");
    firestore
      .doc(id)
      .set({ state }, { merge: true })
      .then(() => {
        toast.success(
          `¡El estado del área: ${
            areas.find((value) => value.id === id)?.name
          }, ha cambiado!`
        );
      })
      .catch((error) => toast.error(error.message));
  };

  return (
    <>
      {!isLoaded(areas) ? (
        <p className="m-2 text-center">Cargando áreas...</p>
      ) : (
        <AreaManagement
          areas={areas}
          rol={ERol.Admin}
          onAreaStateChange={onAreaStateChange}
        />
      )}
    </>
  );
};

export default AdminAreaPage;
