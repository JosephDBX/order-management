import React, { useState } from "react";
import { IOrder } from "../../models/IOrder";
import { ERol } from "../../models/ERol";
import { IOrderTest } from "../../models/IOrderTest";
import { IOrderProfile } from "../../models/IOrderProfile";
import { Link, useHistory } from "react-router-dom";
import SummaryLayout from "../../layouts/SummaryLayout";
import ModalLayout from "../../layouts/ModalLayout";
import moment from "moment";
import "moment/locale/es";
import { ITest } from "../../models/ITest";
import { IProfile } from "../../models/IProfile";
import { IUser } from "../../models/IUser";
import { IPatient } from "../../models/IPatient";

interface IOrderDetailProps {
  order: IOrder;
  orderTests: IOrderTest[];
  orderProfiles: IOrderProfile[];
  tests: ITest[];
  profiles: IProfile[];
  rol: ERol;
  patient: IPatient;
  isMain?: boolean;
  doctor?: IUser;
  onOrderStateChange?(id: string, state: string): void;
}

moment.relativeTimeRounding(Math.floor);

const OrderDetail: React.FunctionComponent<IOrderDetailProps> = ({
  order,
  orderTests,
  orderProfiles,
  tests,
  profiles,
  rol,
  patient,
  isMain,
  doctor,
  onOrderStateChange,
}) => {
  const history = useHistory();
  const navigateToEdit = () => {
    switch (rol) {
      case ERol.Receptionist: {
        history.push(
          `/receptionist-panel/patients/${patient.id}/orders/${order.id}/edit`
        );
        break;
      }
      default: {
        history.push(
          `/user-panel/patients/${patient.id}/orders/${order.id}/edit`
        );
        break;
      }
    }
  };
  const navigateToOrderManagement = () => {
    switch (rol) {
      case ERol.Receptionist: {
        history.push(`/receptionist-panel/patients/${patient.id}`);
        break;
      }
      default: {
        history.push(`/user-panel/patients/${patient.id}`);
        break;
      }
    }
  };

  const [modal, setModal] = useState({ isOpen: false, type: "" });
  const onOpenModal = (type: string) => {
    setModal({ isOpen: true, type });
  };
  const onCloseModal = () => {
    setModal({ isOpen: false, type: modal.type });
  };

  const onSwitchState = () => {
    if (onOrderStateChange) onOrderStateChange(order.id as string, modal.type);
    if (modal.type === "delete" && isMain) navigateToOrderManagement();
    onCloseModal();
  };

  const getTotal = () => {
    let sum: number = 0.0;
    orderTests.forEach((ot) => (sum += Number.parseFloat(ot.cost.toString())));
    orderProfiles.forEach(
      (op) => (sum += Number.parseFloat(op.cost.toString()))
    );
    sum += Number.parseFloat(order.delivery?.toString() as string);
    sum -= Number.parseFloat(order.discount?.toString() as string);
    return sum.toFixed(2);
  };

  return (
    <>
      <SummaryLayout
        title="Orden de examen"
        styleTitle={
          order.state === "complete"
            ? "bg-blue-600 text-white"
            : order.state === "process"
            ? "bg-red-600 text-white"
            : "bg-teal-600 text-white"
        }
        component={
          <>
            <div
              className={`rounded-full m-2 mt-0 ${
                order.state === "complete"
                  ? "bg-blue-600"
                  : order.state === "pending"
                  ? "bg-teal-600"
                  : order.state === "process"
                  ? "bg-red-600"
                  : ""
              }`}
            >
              <p className="text-white text-center font-semibold p-2 text-lg">
                {order.state === "complete"
                  ? "Completada"
                  : order.state === "pending"
                  ? "Pendiente"
                  : order.state === "process"
                  ? "En Proceso"
                  : ""}
              </p>
            </div>
            {rol === ERol.Laboratorist || rol === ERol.DeliveryWorker ? (
              <div
                className={`rounded-full m-2 mt-0 ${
                  order.state === "complete"
                    ? "bg-blue-600"
                    : order.state === "pending"
                    ? "bg-teal-600"
                    : order.state === "process"
                    ? "bg-red-600"
                    : ""
                }`}
              >
                <p className="text-white text-center font-semibold p-2 text-lg">
                  Paciente: {patient.name} {patient.surname}
                </p>
                <p className="text-white text-center font-semibold text-lg">
                  Fecha de nacimiento:
                </p>
                <p className="text-white text-center font-semibold text-lg">
                  {moment(patient.birthDate).format("dddd D/MMMM/YYYY")}
                </p>
                <p className="text-white text-center font-semibold text-lg">
                  {moment(patient.birthDate).fromNow(true)}
                </p>
              </div>
            ) : null}
            <div
              className="h-32 p-8 relative rounded-full mx-auto shadow-md flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(145deg, #3182CEE0 30%, #319795F0 60%), url('/bg_test.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h3 className="text-center rounded-sm p-4 text-white text-2xl">
                {moment(order.orderedTo).format("dddd D/MMMM/YYYY hh:mm a")}
              </h3>
              <div className="bg-red-600 rounded-full absolute right-0 top-0">
                <p className="text-white text-center font-semibold p-2 text-lg">
                  USD ${getTotal()}
                </p>
              </div>
            </div>
            <hr className="m-2" />
            {orderTests.length > 0 && (
              <>
                <div className="rounded-sm shadow my-4">
                  <h4 className="text-center m-2 text-lg">
                    <span className="m-4 mb-1 font-semibold">Exámenes: </span>
                    {orderTests.length}
                  </h4>
                  <hr className="m-2" />
                  <div className="frame" style={{ maxHeight: "8rem" }}>
                    {orderTests.map((ot) => (
                      <div className="rounded-sm m-1 shadow-md p-2" key={ot.id}>
                        <h4 className="flex items-center">
                          <Link
                            to={`/search?test=${ot.test}`}
                            target="_blank"
                            className="material-icons btn-icon btn-icon-secondary p-0 border-0"
                          >
                            pageview
                          </Link>
                          <span className="flex-grow">
                            {tests.find((t) => t.id === ot.test)?.name}
                          </span>
                          <span>
                            ${Number.parseFloat(ot.cost.toString()).toFixed(2)}
                          </span>
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            {orderProfiles.length > 0 && (
              <>
                <div className="rounded-sm shadow my-4">
                  <h4 className="text-center m-2 text-lg">
                    <span className="m-4 mb-1 font-semibold">Perfiles: </span>
                    {orderProfiles.length}
                  </h4>
                  <hr className="m-2" />
                  <div className="frame" style={{ maxHeight: "8rem" }}>
                    {orderProfiles.map((op) => (
                      <div className="rounded-sm m-1 shadow-md p-2" key={op.id}>
                        <h4 className="flex items-center">
                          <Link
                            to={`/search?profile=${op.profile}`}
                            target="_blank"
                            className="material-icons btn-icon btn-icon-secondary p-0 border-0"
                          >
                            pageview
                          </Link>
                          <span className="flex-grow">
                            {profiles.find((p) => p.id === op.profile)?.name}
                          </span>
                          <span>
                            ${Number.parseFloat(op.cost.toString()).toFixed(2)}
                          </span>
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            {order.delivery && order.delivery > 0 && (
              <h4 className="text-center m-2">
                <span className="m-4 mb-1 font-semibold">
                  Costo del servicio a domicilio:{" "}
                </span>
                ${order.delivery.toFixed(2)}
              </h4>
            )}
            {order.discount && order.discount > 0 ? (
              <h4 className="text-center m-2">
                <span className="m-4 mb-1 font-semibold">Descuento: </span>$
                {order.discount.toFixed(2)}
              </h4>
            ) : null}
            {doctor ? (
              <>
                <p className="m-4 mb-1 font-semibold text-center">
                  Médico ordenando el examen:
                </p>
                <p className="text-center m-4 mt-1">{doctor.userName}</p>
              </>
            ) : null}
            <p className="m-4 mb-1 font-semibold text-center">
              Método de pago y otros datos:
            </p>
            <p className="text-center m-4 mt-1">{order.description}</p>
          </>
        }
        code={order.id}
        controls={
          <>
            {((order.state === "pending" && rol === ERol.Public) ||
              (rol === ERol.Receptionist && order.state !== "complete")) && (
              <button className="btn btn-warning m-2" onClick={navigateToEdit}>
                {isMain ? "Editar Orden" : "Editar"}
              </button>
            )}
            {order.state === "pending" &&
              (rol === ERol.Public || rol === ERol.Receptionist) && (
                <button
                  className="btn btn-danger m-2"
                  onClick={() => onOpenModal("delete")}
                >
                  Eliminar
                </button>
              )}
            {order.state === "pending" &&
              (rol === ERol.DeliveryWorker || rol === ERol.Receptionist) && (
                <button
                  className="btn m-2"
                  onClick={() => onOpenModal("process")}
                >
                  Muestra Tomada
                </button>
              )}
            {order.state === "process" &&
              (rol === ERol.Laboratorist || rol === ERol.Receptionist) && (
                <button
                  className="btn m-2"
                  onClick={() => onOpenModal("complete")}
                >
                  Completar Orden
                </button>
              )}
          </>
        }
      />
      <ModalLayout
        title={`¿Estás realmente seguro de ${
          modal.type === "delete"
            ? "eliminar"
            : modal.type === "process"
            ? "haber tomado la muestra de"
            : modal.type === "complete"
            ? "haber terminado"
            : ""
        } la orden?`}
        open={modal.isOpen}
        component={
          <>
            <p className="m-2 text-justify pb-2">
              {modal.type === "delete"
                ? "¡La orden se eliminará de forma permanente!"
                : modal.type === "process"
                ? "¡La orden cambiará su estado a 'En Proceso' y el usuario ya no podrá editarla!"
                : modal.type === "complete"
                ? "¡La orden cambiará su estado a 'Completa' y el laboratorista ya no podrá verla!"
                : ""}
            </p>
            <hr />
            <div className="flex justify-end">
              <button
                className={`btn ${
                  modal.type === "delete" ? "btn-danger" : "btn-warning"
                } m-2`}
                onClick={onSwitchState}
              >
                {modal.type === "delete"
                  ? "Eliminar"
                  : modal.type === "process"
                  ? "Muestra Tomada"
                  : modal.type === "complete"
                  ? "Completar Orden"
                  : ""}
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

export default OrderDetail;
