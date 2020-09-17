import React, { useState } from "react";
import { useFirestore } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import { IPatient } from "../../models/IPatient";
import { toast } from "react-toastify";
import PatientCreate from "../../components/patient/PatientCreate";
import { IUser } from "../../models/IUser";
import { useSelector } from "react-redux";
import { IUserPatient } from "../../models/IUserPatient";
import Loading from "../../components/custom/Loading";

const PatientCreatePage: React.FunctionComponent = () => {
  const firestore = useFirestore();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);

  const currentUser: IUser = useSelector(
    (state: any) => state.firebase.profile
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
        const user_patient: IUserPatient = {
          user: currentUser.uid as string,
          patient: result.id,
        };
        return firestore
          .collection("user_patients")
          .doc(`${currentUser.uid}_${result.id}`)
          .set(user_patient);
      })
      .then(() => {
        if (aux) history.push(`/user-panel/patients/${aux}`);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message);
      });
  };

  return (
    <>
      <PatientCreate onCreatePatient={onCreatePatient} />
      <Loading isLoading={isLoading} />
    </>
  );
};

export default PatientCreatePage;
