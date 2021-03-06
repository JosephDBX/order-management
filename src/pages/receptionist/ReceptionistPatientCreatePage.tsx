import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  isLoaded,
  useFirestore,
  useFirestoreConnect,
} from "react-redux-firebase";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Breadcrumbs from "../../components/custom/Breadcrumbs";
import Loading from "../../components/custom/Loading";
import PatientCreate from "../../components/patient/PatientCreate";
import { IPatient } from "../../models/IPatient";
import { IUser } from "../../models/IUser";
import { IUserPatient } from "../../models/IUserPatient";

const ReceptionistPatientCreatePage: React.FunctionComponent = () => {
  const { id = "" } = useParams<{ id?: string }>();

  const firestore = useFirestore();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);

  useFirestoreConnect([{ collection: "users", doc: id }]);
  const user: IUser = useSelector(
    ({ firestore: { data } }: any) => data.users && data.users[id]
  );

  const onCreatePatient = (patient: IPatient) => {
    setIsLoading(true);
    toast.info("Procesando... por favor espere...");
    let aux = "";
    firestore
      .collection("patients")
      .add(patient)
      .then((result) => {
        toast.success(`Nuevo paciente creado con Código: ${result.id}`);
        aux = result.id;
        if (id) {
          const user_patient: IUserPatient = {
            user: user.uid as string,
            patient: result.id,
          };
          return firestore
            .collection("user_patients")
            .doc(`${user.uid}_${result.id}`)
            .set(user_patient);
        } else {
          return;
        }
      })
      .then(() => {
        if (aux) {
          history.push(`/receptionist-panel/patients/${aux}`);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message);
      });
  };

  return (
    <>
      {!isLoaded(user) && id ? (
        <p className="m-2 text-center">Cargando Pacientes...</p>
      ) : (
        <>
          {id ? (
            <Breadcrumbs
              navigations={[
                { uri: "/home", text: "Home" },
                { uri: "/receptionist-panel", text: "Panel de recepcionista" },
                { uri: "/receptionist-panel/users", text: "Usuarios" },
                { uri: `/receptionist-panel/users/${id}`, text: user.email },
              ]}
              last="Crear paciente"
            />
          ) : (
            <Breadcrumbs
              navigations={[
                { uri: "/home", text: "Home" },
                { uri: "/receptionist-panel", text: "Panel de recepcionista" },
                { uri: "/receptionist-panel/patients", text: "Pacientes" },
              ]}
              last="Crear paciente"
            />
          )}
          <PatientCreate onCreatePatient={onCreatePatient} />
          <Loading isLoading={isLoading} />
        </>
      )}
    </>
  );
};

export default ReceptionistPatientCreatePage;
