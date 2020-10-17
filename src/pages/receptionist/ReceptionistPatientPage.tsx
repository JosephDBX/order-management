import React from "react";
import { useSelector } from "react-redux";
import {
  isLoaded,
  useFirebase,
  useFirestore,
  useFirestoreConnect,
} from "react-redux-firebase";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Breadcrumbs from "../../components/custom/Breadcrumbs";
import PatientManagement from "../../components/patient/PatientManagement";
import UserDetail from "../../components/user/UserDetail";
import MainDetailLayout from "../../layouts/MainDetailLayout";
import { ERol } from "../../models/ERol";
import { IPatient } from "../../models/IPatient";
import { IUser } from "../../models/IUser";
import { IUserPatient } from "../../models/IUserPatient";

const ReceptionistPatientPage: React.FunctionComponent = () => {
  const { id = "" } = useParams<{ id?: string }>();
  useFirestoreConnect([
    { collection: "patients" },
    { collection: "user_patients" },
    { collection: "users", doc: id },
  ]);
  const patients: IPatient[] = useSelector(
    (state: any) => state.firestore.ordered.patients
  );
  const user_patients: IUserPatient[] = useSelector(
    (state: any) => state.firestore.ordered.user_patients
  );
  const user: IUser = useSelector(
    ({ firestore: { data } }: any) => data.users && data.users[id]
  );

  const firebase = useFirebase();
  const onRestorePassword = (email: string) => {
    toast.info("Procesando... por favor espere...");
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        toast.success(
          `Se ha enviado un correo electrónico a "${email}", de restablecimiento de contraseña.`
        );
      })
      .catch((error) => {
        toast.error(error.messsage);
      });
  };

  const firestore = useFirestore();
  const onUserNameChange = (id: string, userName: string) => {
    toast.info("Procesando... por favor espere...");
    firestore
      .collection("users")
      .doc(id)
      .set({ userName: userName }, { merge: true })
      .then(() => {
        toast.success(
          `¡El nombre del usuario con email: ${user.email}, ha cambiado!`
        );
      })
      .catch((error) => toast.error(error.message));
  };

  const onAddPatientByCode = (id: string) => {
    toast.info("Procesando... por favor espere...");
    const aux = patients.find((p) => p.id === id);
    if (aux) {
      const user_patient: IUserPatient = {
        user: user.uid as string,
        patient: aux.id as string,
      };
      firestore
        .collection("user_patients")
        .doc(`${user.uid}_${aux.id}`)
        .set(user_patient)
        .then(() => {
          toast.success(
            `¡Paciente: ${aux.name} ${aux.surname}, se ha agregado a la cuenta de: ${user.userName}!`
          );
        })
        .catch((error) => {
          toast.error(error);
        });
    } else {
      toast.error(`¡El paciente con id: ${id}, no existe!`);
    }
  };

  const onRemovePatient = (patient: IPatient) => {
    toast.info("Procesando... por favor espere...");
    firestore
      .collection("user_patients")
      .doc(`${user.uid}_${patient.id}`)
      .delete()
      .then(() => {
        toast.success(
          `¡Paciente: ${patient.name} ${patient.surname}, ha sido removido de la cuenta de: ${user.userName}!`
        );
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <>
      {(!isLoaded(user) && id) ||
      !isLoaded(patients) ||
      !isLoaded(user_patients) ? (
        <p className="m-2 text-center">Cargando Pacientes...</p>
      ) : id ? (
        <>
          <Breadcrumbs
            navigations={[
              { uri: "/home", text: "Home" },
              { uri: "/receptionist-panel", text: "Panel de recepcionista" },
              { uri: "/receptionist-panel/users", text: "Usuarios" },
            ]}
            last={user.email}
          />
          <MainDetailLayout
            title={
              id
                ? `Gestionar pacientes asociados a la cuenta: ${user.email}`
                : "Gestionar pacientes"
            }
            main={
              <UserDetail
                user={{ id: id, ...user }}
                rol={ERol.Receptionist}
                isMain
                onUserNameChange={onUserNameChange}
                onRestorePassword={onRestorePassword}
              />
            }
            detail={
              <PatientManagement
                rol={ERol.Receptionist}
                patients={patients.filter(
                  (patient) =>
                    user_patients
                      .filter((up) => up.user === user.uid)
                      .filter((up) => up.patient === patient.id).length > 0
                )}
                idUser={id}
                onAddPatientByCode={onAddPatientByCode}
                onRemove={onRemovePatient}
              />
            }
          />
        </>
      ) : (
        <>
          <Breadcrumbs
            navigations={[
              { uri: "/home", text: "Home" },
              { uri: "/receptionist-panel", text: "Panel de recepcionista" },
            ]}
            last="Pacientes"
          />
          <PatientManagement
            rol={ERol.Receptionist}
            patients={patients}
            isFull
          />
        </>
      )}
    </>
  );
};

export default ReceptionistPatientPage;
