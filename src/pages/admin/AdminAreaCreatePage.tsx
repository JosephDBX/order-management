import React from "react";
import AreaCreate from "../../components/area/AreaCreate";
import { IArea } from "../../models/IArea";
import { useFirestore } from "react-redux-firebase";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const AdminAreaCreatePage: React.FunctionComponent = () => {
  const firestore = useFirestore();
  const history = useHistory();

  const onCreateArea = (area: IArea) => {
    toast.info("Procesando... por favor espere...");
    firestore
      .collection("areas")
      .add(area)
      .then((result) => {
        toast.success(`Nueva área de examen creada con id:${result.id}`);
        history.push(`/admin-panel/areas/${result.id}`);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return <AreaCreate onCreateArea={onCreateArea} />;
};

export default AdminAreaCreatePage;
