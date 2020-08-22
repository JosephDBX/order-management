import React from "react";
import { useFirestore } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import { IPatient } from "../../models/IPatient";
import { toast } from "react-toastify";
import PatientCreate from "../../components/patient/PatientCreate";

const PatientCreatePage: React.FunctionComponent = () => {
  const firestore = useFirestore();
  const history = useHistory();

  const onCreatePatient = (patient: IPatient) => {
    toast.info("Procesando... por favor espere...");
    /*firestore
      .collection("patients")
      .add(patient)
      .then((result) => {
        toast.success(`Nueva área de examen creada con id:${result.id}`);
        history.push(`/admin-panel/areas/${result.id}`);
      })
      .catch((error) => {
        toast.error(error.message);
      });*/
  };

  return <PatientCreate onCreatePatient={onCreatePatient} />;
};

export default PatientCreatePage;
