import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  isEmpty,
  isLoaded,
  useFirestore,
  useFirestoreConnect,
} from "react-redux-firebase";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Breadcrumbs from "../../components/custom/Breadcrumbs";
import Loading from "../../components/custom/Loading";
import PatientEdit from "../../components/patient/PatientEdit";
import { IPatient } from "../../models/IPatient";

const ReceptionistPatientEditPage: React.FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const firestore = useFirestore();

  const [isLoading, setIsLoading] = useState(false);

  useFirestoreConnect(() => [{ collection: "patients", doc: id }]);

  const currentPatient: IPatient = useSelector(
    ({ firestore: { data } }: any) => data.patients && data.patients[id]
  );

  const navigateToPatientManagement = () => {
    history.push("/receptionist-panel/patients");
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
        history.push(`/receptionist-panel/patients/${id}`);
      })
      .catch((error) => {
        setIsLoading(false);
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
        <>
          <Breadcrumbs
            navigations={[
              { uri: "/home", text: "Home" },
              { uri: "/receptionist-panel", text: "Panel de recepcionista" },
              { uri: "/receptionist-panel/patients", text: "Pacientes" },
              {
                uri: `/receptionist-panel/patients/${id}`,
                text: `${currentPatient.name} ${currentPatient.surname}`,
              },
            ]}
            last="Editar paciente"
          />
          <PatientEdit
            currentPatient={currentPatient}
            onEditPatient={onEditPatient}
          />
        </>
      )}
      <Loading isLoading={isLoading} />
    </>
  );
};

export default ReceptionistPatientEditPage;
