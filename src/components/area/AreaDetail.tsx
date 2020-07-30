import React from "react";
import { IArea } from "../../models/IArea";
import { ERol } from "../../models/ERol";
import SummaryLayout from "../../layouts/SummaryLayout";
import { useHistory } from "react-router-dom";

interface IAreaDetailProps {
  area: IArea;
  rol: ERol;
}

const AreaDetail: React.FunctionComponent<IAreaDetailProps> = ({
  area,
  rol,
}) => {
  const history = useHistory();
  const navigateToSearch = () => {
    if (rol === ERol.Admin) history.push(`/admin-panel/areas/${area.id}`);
    else history.push(`/search/?area=${area.id}`);
  };

  return (
    <SummaryLayout
      title={area.name}
      styleTitle={
        rol === ERol.Public
          ? "bg-blue-600 text-white"
          : "bg-teal-600 text-white"
      }
      component={
        <>
          {rol === ERol.Admin && (
            <div className="bg-gray-600 mx-auto rounded-full p-1">
              <p className="text-center text-white font-code">{`Código:${area.id}`}</p>
            </div>
          )}
          <p className="text-center m-2 font-semibold">Descripción</p>
          <p className="text-justify m-2">{area.description}</p>
        </>
      }
      controls={
        <>
          <button className="btn btn-secondary" onClick={navigateToSearch}>
            Detalles
          </button>
          {rol === ERol.Admin && (
            <>
              <button className="btn btn-warning">Editar</button>
              <button className="btn btn-danger">Borrar</button>
            </>
          )}
        </>
      }
    />
  );
};

export default AreaDetail;
