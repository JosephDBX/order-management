import React from "react";
import { ERol } from "../../models/ERol";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { IPatient } from "../../models/IPatient";

interface IOrderControlProps {
  patient: IPatient;
  rol: ERol;
  defaultText?: string;
  onFilterText(filterText: string, state: string): void;
}

type Inputs = {
  filterText: string;
  state: string;
};

const OrderControl: React.FunctionComponent<IOrderControlProps> = ({
  patient,
  rol,
  defaultText,
  onFilterText,
}) => {
  const { register, watch } = useForm<Inputs>();

  const history = useHistory();
  const navigateToCreate = () => {
    switch (rol) {
      case ERol.Public: {
        history.push(`/user-panel/patients/${patient.id}/orders/create`);
        break;
      }
      case ERol.Receptionist: {
        history.push(
          `/receptionist-panel/patients/${patient.id}/orders/create`
        );
        break;
      }
    }
  };

  const onSubmit = () => {
    onFilterText(watch("filterText"), watch("state"));
  };

  return (
    <div className="m-2">
      <h3 className="m-1 text-center">Filtrar orden</h3>
      <hr />
      <div className="flex flex-col justify-between sm:flex-row">
        <form className="flex flex-grow flex-col justify-start sm:flex-row">
          <div className="input-group mt-8">
            <input
              className="input input-secondary"
              type="text"
              name="filterText"
              placeholder="Código"
              defaultValue={defaultText}
              onChange={onSubmit}
              ref={register}
            />
            <span className="input-hint">
              Código de la orden, nombre del paciente, fecha y hora o médico
              ordenando
            </span>
          </div>
          {rol !== ERol.Laboratorist && rol !== ERol.DeliveryWorker ? (
            <div className="p-2 mx-auto">
              <h3 className="text-right">Estado de la orden</h3>
              <hr className="ml-2 my-2" />
              <div className="input-group flex-row items-center justify-center">
                <select
                  className="input input-secondary"
                  name="state"
                  ref={register}
                  onChange={onSubmit}
                >
                  <option className="text-gray-700 font-semibold" value="">
                    Seleccionar...
                  </option>
                  <option
                    className="text-gray-700 font-semibold"
                    value="pending"
                  >
                    Pendiente
                  </option>
                  <option
                    className="text-gray-700 font-semibold"
                    value="process"
                  >
                    En Proceso
                  </option>
                  <option
                    className="text-gray-700 font-semibold"
                    value="complete"
                  >
                    Completa
                  </option>
                </select>
              </div>
            </div>
          ) : null}
        </form>
        {rol !== ERol.Laboratorist ? (
          <div className="flex flex-col justify-end p-2">
            <button className="btn btn-primary" onClick={navigateToCreate}>
              <span className="material-icons">add_circle</span>Crear Órden
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OrderControl;
