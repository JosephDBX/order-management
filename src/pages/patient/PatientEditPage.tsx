import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  useFirestore,
  useFirestoreConnect,
  isLoaded,
  isEmpty,
} from "react-redux-firebase";
import { IPatient } from "../../models/IPatient";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import PatientEdit from "../../components/patient/PatientEdit";
import Loading from "../../components/custom/Loading";
import Breadcrumbs from "../../components/custom/Breadcrumbs";

const PatientEditPage: React.FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const firestore = useFirestore();

  const [isLoading, setIsLoading] = useState(false);

  useFirestoreConnect(() => [{ collection: "patients", doc: id }]);

  const currentPatient: IPatient = useSelector(
    ({ firestore: { data } }: any) => data.patients && data.patients[id]
  );

  const navigateToPatientManagement = () => {
    history.push("/user-panel/patients");
  };

  const onEditPatient = (patient: IPatient) => {
    setIsLoading(true);
    toast.info("Procesando... por favor espere...");
    firestore
      .collection("patients")
      .doc(id)
      .set(patient, { merge: true })
      .then(() => {
        toast.success(`Paciente con id:${id}, actualizado exitosamente`);
        history.push(`/user-panel/patients/${id}`);
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
          { uri: "/user-panel", text: "Panel de usuario" },
          { uri: "/user-panel", text: "Pacientes" },
        ]}
        last="Editar paciente"
      />
      {!isLoaded(currentPatient) ? (
        <p className="m-2 text-center">Cargando paciente...</p>
      ) : isEmpty(currentPatient) ? (
        <div className="flex flex-col justify-center">
          <p className="m-2 text-center font-code">
            ¡El paciente con id:{id}, no existe!
          </p>
          <button
            className="btn btn-secondary my-4 mx-auto"
            onClick={navigateToPatientManagement}
          >
            <span className="material-icons">arrow_back</span>Regresar a la
            gestión de pacientes
          </button>
        </div>
      ) : (
        <PatientEdit
          currentPatient={currentPatient}
          onEditPatient={onEditPatient}
        />
      )}
      <Loading isLoading={isLoading} />
    </>
  );
};

export default PatientEditPage;
