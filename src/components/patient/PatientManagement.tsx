import React, { useState, useEffect } from "react";
import { ERol } from "../../models/ERol";
import { IPatient } from "../../models/IPatient";
import PatientDetail from "./PatientDetail";
import ManageLayout from "../../layouts/ManageLayout";
import PatientControl from "./PatientControl";
import GridLayout from "../../layouts/GridLayout";

interface IPatientManagementProps {
  rol: ERol;
  patients: IPatient[];
  onAddPatientByCode?(id: string): void;
}

const PatientManagement: React.FunctionComponent<IPatientManagementProps> = ({
  rol,
  patients,
  onAddPatientByCode,
}) => {
  const [list, setList] = useState<any[]>(
    patients.map((patient) => (
      <PatientDetail patient={patient} rol={rol} key={patient.id} />
    ))
  );

  const [filterText, setFilterText] = useState("");
  const onFilter = (ft: string) => {
    setList(
      patients
        .filter(
          (patient) =>
            patient.id?.includes(ft) ||
            `${patient.name} ${patient.surname}`
              .toLowerCase()
              .includes(ft.toLowerCase()) ||
            patient.ind?.toLowerCase().includes(ft.toLowerCase()) ||
            patient.contact.phoneNumber
              .toLowerCase()
              .includes(ft.toLowerCase()) ||
            patient.contact.address?.toLowerCase().includes(ft.toLowerCase()) ||
            patient.contact.email?.toLowerCase().includes(ft.toLowerCase())
        )
        .map((patient) => (
          <PatientDetail patient={patient} rol={rol} key={patient.id} />
        ))
    );
    setFilterText(ft);
  };

  useEffect(() => {
    onFilter(filterText);
  }, [patients]);

  return (
    <ManageLayout
      title="Gestionar pacientes"
      subTitle={
        rol === ERol.Receptionist
          ? "¡Todos nuestros pacientes!"
          : rol === ERol.Doctor
          ? "¡Todos los pacientes asociados a su cuenta!"
          : "Aquí puede gestionar los pacientes asociados a su cuenta, ¡hasta un máximo de 10 pacientes!"
      }
      controls={
        <PatientControl
          rol={rol}
          disableCreate={rol === ERol.Public && list.length > 9}
          onFilterText={onFilter}
          onAddPatientByCode={onAddPatientByCode}
        />
      }
      list={
        <GridLayout list={list} type={1} defaultText="No hay pacientes!!!" />
      }
    />
  );
};

export default PatientManagement;
