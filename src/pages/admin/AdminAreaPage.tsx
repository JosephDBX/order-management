import React from "react";
import AreaManagement from "../../components/area/AreaManagement";
import { ERol } from "../../models/ERol";
import { useFirestoreConnect, isLoaded } from "react-redux-firebase";
import { IArea } from "../../models/IArea";
import { useSelector } from "react-redux";

const AdminAreaPage: React.FunctionComponent = () => {
  useFirestoreConnect([{ collection: "areas" }]);
  const areas: IArea[] = useSelector(
    (state: any) => state.firestore.ordered.areas
  );
  return (
    <>
      {!isLoaded(areas) ? (
        <p className="m-2 text-center">Cargando áreas...</p>
      ) : (
        <AreaManagement areas={areas} rol={ERol.Admin} />
      )}
    </>
  );
};

export default AdminAreaPage;
