import React, { useState, ChangeEvent } from "react";
import { ERol } from "../../models/ERol";

interface IAreaControlProps {
  rol: ERol;
  onFilterText(filterText: string): void;
}

const AreaControl: React.FunctionComponent<IAreaControlProps> = ({
  rol,
  onFilterText,
}) => {
  const [filterText, setFilterText] = useState("");
  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
    onFilterText(event.target.value);
  };
  return (
    <div className="m-2">
      <h3 className="m-1 text-center md:text-left">Filtrar área</h3>
      <div className="flex flex-col md:flex-row">
        <div className="input-group">
          <input
            className="input input-secondary"
            type="text"
            placeholder="Nombre de área"
            onChange={onInputChange}
            value={filterText}
          />
          <span className="input-hint">
            {rol === ERol.Admin ? "Código, n" : "N"}ombre o descripción
          </span>
        </div>
        <div className="flex-grow p-4"></div>
        {rol === ERol.Admin && (
          <div className="flex flex-row md:flex-col justify-center">
            <button className="btn btn-primary">
              <span className="material-icons">add_circle</span>Crear Área
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AreaControl;
