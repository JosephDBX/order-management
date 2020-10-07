import React from "react";
import {
  useFirestoreConnect,
  isLoaded,
  useFirebase,
  useFirestore,
} from "react-redux-firebase";
import { IPatient } from "../../models/IPatient";
import { useSelector } from "react-redux";
import { IUser } from "../../models/IUser";
import MainDetailLayout from "../../layouts/MainDetailLayout";
import UserDetail from "../../components/user/UserDetail";
import { ERol } from "../../models/ERol";
import { toast } from "react-toastify";
import PatientManagement from "../../components/patient/PatientManagement";
import { IUserPatient } from "../../models/IUserPatient";
import Breadcrumbs from "../../components/custom/Breadcrumbs";

const PatientPanel: React.FunctionComponent = () => {
  useFirestoreConnect([
    { collection: "patients" },
    { collection: "user_patients" },
  ]);
  const patients: IPatient[] = useSelector(
    (state: any) => state.firestore.ordered.patients
  );
  const user_patients: IUserPatient[] = useSelector(
    (state: any) => state.firestore.ordered.user_patients
  );
  const currentUser: IUser = useSelector(
    (state: any) => state.firebase.profile
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
          `¡El nombre del usuario con email: ${currentUser.email}, ha cambiado!`
        );
      })
      .catch((error) => toast.error(error.message));
  };

  const onAddPatientByCode = (id: string) => {
    toast.info("Procesando... por favor espere...");
    const aux = patients.find((p) => p.id === id);
    if (aux) {
      const user_patient: IUserPatient = {
        user: currentUser.uid as string,
        patient: aux.id as string,
      };
      firestore
        .collection("user_patients")
        .doc(`${currentUser.uid}_${aux.id}`)
        .set(user_patient)
        .then(() => {
          toast.success(
            `¡Paciente: ${aux.name} ${aux.surname}, se ha agregado a la cuenta de: ${currentUser.userName}!`
          );
        })
        .catch((error) => {
          toast.error(error);
        });
    } else {
      toast.error(`¡El paciente con id: ${id}, no existe!`);
    }
  };

  return (
    <>
      <Breadcrumbs
        navigations={[
          { uri: "/home", text: "Home" },
          { uri: "/user-panel", text: "Panel de usuario" },
        ]}
        last="Pacientes"
      />
      {!isLoaded(currentUser) ||
      !isLoaded(patients) ||
      !isLoaded(user_patients) ? (
        <p className="m-2 text-center">Cargando Pacientes...</p>
      ) : (
        <MainDetailLayout
          title="Gestionar pacientes asociados con su cuenta"
          main={
            <UserDetail
              user={currentUser}
              rol={currentUser.roles?.isDoctor ? ERol.Doctor : ERol.Public}
              isMain
              onUserNameChange={onUserNameChange}
              onRestorePassword={onRestorePassword}
            />
          }
          detail={
            <PatientManagement
              rol={currentUser.roles?.isDoctor ? ERol.Doctor : ERol.Public}
              patients={patients.filter(
                (patient) =>
                  user_patients
                    .filter((up) => up.user === currentUser.uid)
                    .filter((up) => up.patient === patient.id).length > 0
              )}
              onAddPatientByCode={onAddPatientByCode}
            />
          }
        />
      )}
    </>
  );
};

export default PatientPanel;
