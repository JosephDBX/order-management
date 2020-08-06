import React, { useState, ChangeEvent } from "react";
import { ERol } from "../../models/ERol";
import { useHistory } from "react-router-dom";

interface ITestControlProps {
  idArea?: string;
  rol: ERol;
  onFilterText(filterText: string): void;
}

const TestControl: React.FunctionComponent<ITestControlProps> = ({
  idArea,
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
    history.push(`/admin-panel/areas/${idArea}/tests/create`);
  };

  return (
    <div className="m-2">
      <h3 className="m-1 text-center md:text-left">Filtrar examen</h3>
      <div className="flex flex-col md:flex-row">
        <div className="input-group">
          <input
            className="input input-secondary"
            type="text"
            placeholder="Nombre del exámen"
            onChange={onInputChange}
            value={filterText}
          />
          <span className="input-hint">
            {rol === ERol.Admin ? "Código, n" : "N"}ombre, nombres alternativos
            o descripción
          </span>
        </div>
        <div className="flex-grow p-4"></div>
        {rol === ERol.Admin && (
          <div className="flex flex-row md:flex-col justify-center">
            <button className="btn btn-primary" onClick={navigateToCreate}>
              <span className="material-icons">add_circle</span>Crear Exámen
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestControl;
