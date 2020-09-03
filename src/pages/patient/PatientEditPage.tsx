import React from "react";
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

const PatientEditPage: React.FunctionComponent = () => {
  const { id } = useParams();
  const history = useHistory();
  const firestore = useFirestore();
  useFirestoreConnect(() => [{ collection: "patients", doc: id }]);

  const currentPatient: IPatient = useSelector(
    ({ firestore: { data } }: any) => data.patients && data.patients[id]
  );

  const navigateToPatientManagement = () => {
    history.push("/user-panel/patients");
  };

  const onEditPatient = (patient: IPatient) => {
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
        toast.error(error.message);
      });
  };

  return (
    <>
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
    </>
  );
};

export default PatientEditPage;
