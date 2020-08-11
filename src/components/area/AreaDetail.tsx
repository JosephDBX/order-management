import React, { useState } from "react";
import { IArea } from "../../models/IArea";
import { ERol } from "../../models/ERol";
import SummaryLayout from "../../layouts/SummaryLayout";
import { useHistory } from "react-router-dom";
import ModalLayout from "../../layouts/ModalLayout";

interface IAreaDetailProps {
  area: IArea;
  rol: ERol;
  isMain?: boolean;
  onAreaStateChange?(id: string, state: boolean): void;
}

const AreaDetail: React.FunctionComponent<IAreaDetailProps> = ({
  area,
  rol,
  isMain,
  onAreaStateChange,
}) => {
  const history = useHistory();
  const navigateToSearch = () => {
    if (rol === ERol.Admin) history.push(`/admin-panel/areas/${area.id}`);
    else history.push(`/search/?area=${area.id}`);
  };
  const navigateToEdit = () => {
    history.push(`/admin-panel/areas/${area.id}/edit`);
  };
  const onSwitchActive = () => {
    if (onAreaStateChange) onAreaStateChange(area.id as string, !area.state);
    setModal(false);
  };

  const [modal, setModal] = useState(false);
  const onOpenModal = () => {
    setModal(true);
  };
  const onCloseModal = () => {
    setModal(false);
  };

  return (
    <>
      <SummaryLayout
        title="Área"
        styleTitle={
          rol === ERol.Public
            ? "bg-blue-600 text-white"
            : area.state
            ? "bg-teal-600 text-white"
            : "bg-red-600 text-white"
        }
        component={
          <>
            <div
              className="w-48 h-48 rounded-full mx-auto shadow-md flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(145deg, #3182CEC0 30%, #319795D0 60%), url('/bg_area.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h3 className="text-center rounded-sm p-2 text-white text-2xl">
                {area.name}
              </h3>
            </div>
            {rol === ERol.Admin && (
              <div className="flex justify-center my-4">
                <div
                  className={`rounded-full bg-${
                    area.state ? "teal-600" : "red-600"
                  }`}
                >
                  <p className="text-white text-center font-semibold p-2">
                    Estado:{" "}
                    <span className="underline">
                      {area.state ? "A" : "Desa"}ctivado
                    </span>
                  </p>
                </div>
              </div>
            )}
            <p className="text-center m-4 font-semibold">Descripción</p>
            <p className="text-justify m-4">{area.description}</p>
          </>
        }
        code={rol !== ERol.Public ? area.id : ""}
        controls={
          <>
            {!isMain && (
              <button className="btn btn-secondary" onClick={navigateToSearch}>
                Detalles
              </button>
            )}
            {rol === ERol.Admin && (
              <>
                <button className="btn btn-warning" onClick={navigateToEdit}>
                  {isMain ? "Editar Nombre y Descripción" : "Editar"}
                </button>
                {!isMain && (
                  <button
                    className={`btn btn-${area.state ? "danger" : "primary"}`}
                    onClick={onOpenModal}
                  >
                    {area.state ? "Desa" : "A"}ctivar
                  </button>
                )}
              </>
            )}
          </>
        }
      />
      <ModalLayout
        title={`¿Estás realmente seguro de ${
          area.state ? "des" : ""
        }activar el área?`}
        open={modal}
        component={
          <>
            <p className="m-2 text-justify pb-2">
              {area.state
                ? "¡Desactivar el área desactivará todos los exámenes que le pertenecen!"
                : "Solo se activará el área, ¡recuerde que tendrá que activar cada examen por separado!"}
            </p>
            <hr />
            <div className="flex justify-end">
              <button
                className={`btn btn-${area.state ? "danger" : "primary"} m-2`}
                onClick={onSwitchActive}
              >
                {area.state ? "Desa" : "A"}ctivar
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

export default AreaDetail;
