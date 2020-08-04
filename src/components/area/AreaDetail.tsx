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
      title={`Código:${area.id}`}
      styleTitle={
        rol === ERol.Public
          ? "bg-blue-600 text-white"
          : "bg-teal-600 text-white"
      }
      component={
        <>
          <div
            className="w-48 h-48 rounded-full mx-auto shadow-md flex items-center justify-center"
            style={{
              background:
                "linear-gradient(145deg, #3182CED0 30%, #319795E0 60%), url('bg_area.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h3 className="text-center rounded-sm p-2 text-white text-xl">
              {area.name}
            </h3>
          </div>
          <p className="text-center m-4 font-semibold">Descripción</p>
          <p className="text-justify m-4">{area.description}</p>
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
