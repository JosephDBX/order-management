import React, { useState } from "react";
import { ITest } from "../../models/ITest";
import { ERol } from "../../models/ERol";
import { useHistory } from "react-router-dom";
import SummaryLayout from "../../layouts/SummaryLayout";
import ModalLayout from "../../layouts/ModalLayout";

interface ITestDetailProps {
  test: ITest;
  rol: ERol;
  onTestStateChange?(id: string, state: boolean): void;
  loadArea?: boolean;
}
//!!(test.area as IArea).name
const TestDetail: React.FunctionComponent<ITestDetailProps> = ({
  test,
  rol,
  onTestStateChange,
  loadArea,
}) => {
  const history = useHistory();
  const navigateToArea = () => {
    if (rol === ERol.Admin) history.push(`/admin-panel/areas/${test.area}`);
    else history.push(`/search/?area=${test.area}`);
  };
  const navigateToEdit = () => {
    history.push(`/admin-panel/areas/${test.area}/tests/${test.id}/edit`);
  };
  const onSwitchActive = () => {
    if (onTestStateChange) onTestStateChange(test.id as string, !test.state);
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
        title="Examen"
        styleTitle={
          rol === ERol.Public
            ? "bg-blue-600 text-white"
            : test.state
            ? "bg-teal-600 text-white"
            : "bg-red-600 text-white"
        }
        component={
          <>
            <div
              className="h-32 p-8 relative rounded-full rounded-tl-none rounded-br-none mx-auto shadow-md flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(145deg, #3182CEB0 30%, #319795C0 60%), url('/bg_test.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h3 className="text-center rounded-sm p-4 text-white text-2xl">
                {test.name}
              </h3>
              <div className="bg-red-600 rounded-full absolute right-0 top-0">
                <p className="text-white text-center font-semibold p-2 text-lg">
                  USD ${test.cost}
                </p>
              </div>
            </div>
            {rol === ERol.Admin && (
              <div className="flex justify-end my-4">
                <div
                  className={`rounded-full bg-${
                    test.state ? "teal-600" : "red-600"
                  }`}
                >
                  <p className="text-white text-center font-semibold p-2">
                    Estado:{" "}
                    <span className="underline">
                      {test.state ? "A" : "Desa"}ctivado
                    </span>
                  </p>
                </div>
              </div>
            )}
            {loadArea && (
              <div className="flex justify-center my-4">
                <button className="btn" onClick={navigateToArea}>
                  ver área a la que pertenezco
                </button>
              </div>
            )}
            {!!test.alternative && (
              <div className="rounded-sm shadow my-4">
                <h4 className="text-center m-2 text-lg">
                  Nombres alternativos de examen
                </h4>
                <hr className="m-2" />
                <div className="frame" style={{ maxHeight: "8rem" }}>
                  {test.alternative?.split(/\n/).map((subName, index) => (
                    <div className="rounded-sm m-1 shadow-md p-2" key={index}>
                      <h4 className="flex items-center">
                        <span className="material-icons">label</span>
                        {subName}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="text-center m-4 font-semibold">Descripción</p>
            <p className="text-justify m-4">{test.description}</p>
          </>
        }
        code={rol !== ERol.Public ? test.id : ""}
        controls={
          <>
            {rol === ERol.Admin && (
              <>
                <button className="btn btn-warning" onClick={navigateToEdit}>
                  Editar
                </button>
                <button
                  className={`btn btn-${test.state ? "danger" : "primary"}`}
                  onClick={onOpenModal}
                >
                  {test.state ? "Desa" : "A"}ctivar
                </button>
              </>
            )}
          </>
        }
      />
      <ModalLayout
        title={`¿Estás realmente seguro de ${
          test.state ? "des" : ""
        }activar el examen?`}
        open={modal}
        component={
          <>
            <p className="m-2 text-justify pb-2">
              {test.state
                ? "¡Deshabilitar el examen no permitirá a los usuarios verlo, pero será visible en las órdenes ya creados!"
                : "Solo puede activar el examen si el área que lo contiene está activa!"}
            </p>
            <hr />
            <div className="flex justify-end">
              <button
                className={`btn btn-${test.state ? "danger" : "primary"} m-2`}
                onClick={onSwitchActive}
              >
                {test.state ? "Desa" : "A"}ctivar
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

export default TestDetail;
