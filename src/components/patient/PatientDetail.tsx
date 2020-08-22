import React from "react";
import { IPatient } from "../../models/IPatient";
import { ERol } from "../../models/ERol";

interface IPatientDetailProps {
  patient: IPatient;
  rol: ERol;
  isMain?: boolean;
}

const PatientDetail: React.FunctionComponent<IPatientDetailProps> = ({
  patient,
  rol,
  isMain,
}) => {
  return <div>PatientDetail</div>;
};

export default PatientDetail;
