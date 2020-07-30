import React from "react";
import { IArea } from "../../models/IArea";
import { ERol } from "../../models/ERol";
import SummaryLayout from "../../layouts/SummaryLayout";

interface IAreaDetailProps {
  area: IArea;
  rol: ERol;
}

const AreaDetail: React.FunctionComponent<IAreaDetailProps> = ({
  area,
  rol,
}) => {
  return (
    <SummaryLayout
      title={area.name}
      component={
        <>
          {rol === ERol.Admin && (
            <div className="bg-teal-600 mx-auto rounded-full p-1">
              <p className="text-center text-white font-code">{`Código:${area.id}`}</p>
            </div>
          )}
          <p className="text-center m-2 font-semibold">Descripción</p>
          <p className="text-justify">{area.description}</p>
        </>
      }
      controls={
        <>
          <button className="btn btn-secondary">Detalles</button>
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
