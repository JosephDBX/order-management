import React, { useState } from "react";
import AreaCreate from "../../components/area/AreaCreate";
import { IArea } from "../../models/IArea";
import { useFirestore } from "react-redux-firebase";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import Loading from "../../components/custom/Loading";

const AdminAreaCreatePage: React.FunctionComponent = () => {
  const firestore = useFirestore();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);

  const onCreateArea = (area: IArea) => {
    setIsLoading(true);
    toast.info("Procesando... por favor espere...");
    firestore
      .collection("areas")
      .add(area)
      .then((result) => {
        toast.success(`Nueva área de examen creada con id:${result.id}`);
        history.push(`/admin-panel/areas/${result.id}`);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message);
      });
  };

  return (
    <>
      <AreaCreate onCreateArea={onCreateArea} />
      <Loading isLoading={isLoading} />
    </>
  );
};

export default AdminAreaCreatePage;
