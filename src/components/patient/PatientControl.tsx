import React, { useState, ChangeEvent } from "react";
import { ERol } from "../../models/ERol";
import { useHistory } from "react-router-dom";

interface IPatientControlProps {
  rol: ERol;
  onFilterText(filterText: string): void;
}

const PatientControl: React.FunctionComponent<IPatientControlProps> = ({
  rol,
  onFilterText,
}) => {
  const [filterText, setFilterText] = useState("");
  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
    onFilterText(event.target.value);
  };

  const history = useHistory();
  const navigateToCreate = () => {
    history.push("/user-panel/patients/create");
  };

  return (
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
          <button className="btn btn-primary m-2" onClick={navigateToCreate}>
            <span className="material-icons">add_circle</span>Crear Paciente
          </button>
          {rol !== ERol.Public && (
            <button className="btn btn-secondary m-2">
              <span className="material-icons">add</span>Agregar por código
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientControl;
