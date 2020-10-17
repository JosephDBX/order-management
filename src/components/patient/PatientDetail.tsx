import React, { useState } from "react";
import { IPatient } from "../../models/IPatient";
import { ERol } from "../../models/ERol";
import SummaryLayout from "../../layouts/SummaryLayout";
import moment from "moment";
import "moment/locale/es";
import { useHistory } from "react-router-dom";
import { IOrder } from "../../models/IOrder";
import ModalLayout from "../../layouts/ModalLayout";

interface IPatientDetailProps {
  userId?: string;
  patient: IPatient;
  rol: ERol;
  isMain?: boolean;
  orders?: IOrder[];
  onRemove?(patient: IPatient): void;
}

moment.relativeTimeRounding(Math.floor);

const PatientDetail: React.FunctionComponent<IPatientDetailProps> = ({
  patient,
  rol,
  isMain,
  orders,
  onRemove,
}) => {
  const history = useHistory();
  const navigateToDetail = () => {
    if (rol === ERol.Receptionist)
      history.push(`/receptionist-panel/patients/${patient.id}`);
    else history.push(`/user-panel/patients/${patient.id}`);
  };
  const navigateToEdit = () => {
    if (rol === ERol.Receptionist)
      history.push(`/receptionist-panel/patients/${patient.id}/edit`);
    else history.push(`/user-panel/patients/${patient.id}/edit`);
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
        title="Paciente"
        styleTitle="bg-teal-600 text-white"
        component={
          <>
            <div
              className="rounded-sm mx-auto shadow-md flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(145deg, #3182CEC0 30%, #319795D0 60%)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h3 className="text-center rounded-sm p-2 text-white text-xl">
                {patient.name} {patient.surname}
              </h3>
            </div>
            <p className="m-4 mb-1 font-semibold">Fecha de nacimiento:</p>
            <p className="text-center m-4 mt-1">
              {moment(patient.birthDate).format("dddd D [de] MMMM [de] YYYY")}
            </p>
            <p className="text-center m-4 mt-1">
              {moment(patient.birthDate).fromNow(true)}
            </p>
            {patient.ind && (
              <>
                <p className="m-4 mb-1 font-semibold">Número de cédula:</p>
                <p className="text-center m-4 mt-1">{patient.ind}</p>
              </>
            )}
            <p className="m-4 mb-1">
              <span className="font-semibold">Sexo: </span>
              {patient.sex ? "Masculino" : "Femenino"}
            </p>
            <hr />
            <p className="m-4 mb-1">
              <span className="font-semibold">Número de teléfono: </span>
              {patient.contact.phoneNumber}
            </p>
            {patient.contact.address && (
              <>
                <p className="m-4 mb-1 font-semibold">Dirección:</p>
                <p className="text-center m-4 mt-1">
                  {patient.contact.address}
                </p>
              </>
            )}
            {patient.contact.email && (
              <>
                <p className="m-4 mb-1 font-semibold">Correo electrónico:</p>
                <p className="text-center m-4 mt-1">{patient.contact.email}</p>
              </>
            )}
            {orders && orders.length > 0 ? (
              <>
                <hr />
                <p className="m-1 mt-4 text-center font-semibold text-gray-700">
                  Órdenes: {orders.length}
                </p>
                <p className="m-1 mt-4 text-center font-semibold text-blue-700">
                  Completas:{" "}
                  {orders.filter((o) => o.state === "complete").length}
                </p>
                <p className="m-1 text-center font-semibold text-teal-700">
                  Pendientes:{" "}
                  {orders.filter((o) => o.state === "pending").length}
                </p>
                <p className="m-1 text-center font-semibold text-red-700">
                  En proceso:{" "}
                  {orders.filter((o) => o.state === "process").length}
                </p>
              </>
            ) : null}
          </>
        }
        code={patient.id}
        controls={
          <>
            {!isMain && (
              <button
                className="btn btn-secondary m-2"
                onClick={navigateToDetail}
              >
                Detalles
              </button>
            )}
            <button className="btn btn-warning m-2" onClick={navigateToEdit}>
              {isMain ? "Editar Nombres y Contactos" : "Editar"}
            </button>
            {onRemove ? (
              <button className="btn btn-danger m-2" onClick={onOpenModal}>
                Remover paciente
              </button>
            ) : null}
          </>
        }
      />
      <ModalLayout
        title="¿Estás realmente seguro de remover el paciente de la cuenta actual?"
        open={modal}
        component={
          <>
            <p className="m-2 text-justify pb-2">
              {`¡El paciente: ${patient.name} ${patient.surname} con código: ${patient.id}, será removido de la cuenta actual!`}
            </p>
            <hr />
            <div className="flex justify-end">
              <button
                className="btn btn-danger m-2"
                onClick={() => (onRemove ? onRemove(patient) : onCloseModal())}
              >
                Remover paciente
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

export default PatientDetail;
