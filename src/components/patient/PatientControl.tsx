import React, { useState, ChangeEvent } from "react";
import { ERol } from "../../models/ERol";
import { useHistory } from "react-router-dom";
import ModalLayout from "../../layouts/ModalLayout";

interface IPatientControlProps {
  rol: ERol;
  disableCreate?: boolean;
  noCreate?: boolean;
  idUser?: string;
  onFilterText(filterText: string): void;
  onAddPatientByCode?(id: string): void;
}

const PatientControl: React.FunctionComponent<IPatientControlProps> = ({
  rol,
  disableCreate,
  noCreate,
  idUser,
  onFilterText,
  onAddPatientByCode,
}) => {
  const [filterText, setFilterText] = useState("");
  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
    onFilterText(event.target.value);
  };

  const history = useHistory();
  const navigateToCreate = () => {
    switch (rol) {
      case ERol.Doctor:
      case ERol.Public: {
        history.push("/user-panel/patients/create");
        break;
      }
      case ERol.Receptionist: {
        if (idUser) {
          history.push(`/receptionist-panel/users/${idUser}/patients/create`);
        } else {
          history.push("/receptionist-panel/patients/create");
        }
        break;
      }
    }
  };

  const [modal, setModal] = useState({ isOpen: false, id: "" });
  const onOpenModal = () => {
    setModal({ isOpen: true, id: "" });
  };
  const onCloseModal = () => {
    setModal({ isOpen: false, id: modal.id });
  };

  const onAddPatient = () => {
    if (onAddPatientByCode) onAddPatientByCode(modal.id);
    onCloseModal();
  };

  return (
    <>
      <div className="m-2">
        <h3 className="m-1 text-center md:text-left">Filtrar pacientes</h3>
        <div className="flex flex-col md:flex-row">
          <div className="input-group">
            <input
              className="input input-secondary"
              type="text"
              placeholder="Nombre"
              onChange={onInputChange}
              value={filterText}
            />
            <span className="input-hint">
              Código, nombre, apellido, dni, teléfono, dirección o email
            </span>
          </div>
          <div className="flex-grow p-4"></div>
          <div className="flex flex-row md:flex-col justify-center">
            {disableCreate ? (
              noCreate ? null : (
                <p>Máximo de pacientes alcanzado</p>
              )
            ) : (
              <button
                className="btn btn-primary m-2"
                onClick={navigateToCreate}
                disabled={disableCreate}
              >
                <span className="material-icons">add_circle</span>Crear Paciente
              </button>
            )}
            {rol !== ERol.Public && onAddPatientByCode && (
              <button className="btn btn-secondary m-2" onClick={onOpenModal}>
                <span className="material-icons">add</span>Agregar por código
              </button>
            )}
          </div>
        </div>
      </div>
      <ModalLayout
        title="Agregar por código"
        open={modal.isOpen}
        component={
          <>
            <p className="m-2 text-justify pb-2">
              Ingrese el código de 20 dígitos del paciente para asociarlo con su
              cuenta de usuario
            </p>
            <div className="input-group mt-8">
              <input
                className="input input-secondary"
                type="text"
                name="patientId"
                placeholder="Código del paciente"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setModal({
                    isOpen: modal.isOpen,
                    id: event.target.value,
                  });
                }}
                value={modal.id}
              />
              <span className="input-hint">Código del paciente</span>
            </div>
            <hr />
            <div className="flex justify-end">
              <button
                className="btn btn-warning m-2"
                onClick={onAddPatient}
                disabled={modal.id.length < 20}
              >
                <span className="material-icons">update</span>
                Agregar
              </button>
              <button className="btn m-2" onClick={onCloseModal}>
                Cancelar
              </button>
            </div>
          </>
        }
        onClose={onCloseModal}
      />
    </>
  );
};

export default PatientControl;
