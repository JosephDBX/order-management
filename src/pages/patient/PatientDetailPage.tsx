import React from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  useFirestore,
  useFirestoreConnect,
  isLoaded,
  isEmpty,
} from "react-redux-firebase";
import { IPatient } from "../../models/IPatient";
import { useSelector } from "react-redux";
import { IOrder } from "../../models/IOrder";
import MainDetailLayout from "../../layouts/MainDetailLayout";
import PatientDetail from "../../components/patient/PatientDetail";
import { ERol } from "../../models/ERol";
import OrderManagement from "../../components/order/OrderManagement";

const PatientDetailPage: React.FunctionComponent = () => {
  const { id } = useParams();
  const history = useHistory();
  const firestore = useFirestore();
  useFirestoreConnect(() => [
    { collection: "patients", doc: id },
    { collection: "orders", where: [["patient", "==", id]] },
  ]);

  const currentPatient: IPatient = useSelector(
    ({ firestore: { data } }: any) => data.patients && data.patients[id]
  );
  const orders: IOrder[] = useSelector(
    (state: any) => state.firestore.ordered.orders
  );

  const navigateToPatientManagement = () => {
    history.push("/user-panel");
  };

  const onOrderStateChange = (id: string, state: boolean) => {};

  return (
    <>
      {!isLoaded(currentPatient) ? (
        <p className="m-2 text-center">Cargando paciente...</p>
      ) : isEmpty(currentPatient) ? (
        <div className="flex flex-col justify-center">
          <p className="m-2 text-center font-code">
            ¡El paciente con id:{id}, no existe!
          </p>
          <button
            className="btn btn-secondary my-4 mx-auto"
            onClick={navigateToPatientManagement}
          >
            <span className="material-icons">arrow_back</span>Regresar a la
            gestión de pacientes
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-start">
            <button className="btn m-2" onClick={navigateToPatientManagement}>
              <span className="material-icons">arrow_back</span>Regresar a la
              gestión de pacientes
            </button>
          </div>
          <MainDetailLayout
            title={`Gestionar órdenes del paciente: ${currentPatient.name} ${currentPatient.surname}`}
            main={
              <PatientDetail
                patient={{ id, ...currentPatient }}
                rol={ERol.Public}
                isMain
              />
            }
            detail={
              <>
                {!isLoaded(orders) ? (
                  <p className="m-2 text-center">Cargando órdenes...</p>
                ) : (
                  <OrderManagement
                    rol={ERol.Public}
                    patient={{ id, ...currentPatient }}
                    orders={orders}
                    onOrderStateChange={onOrderStateChange}
                  />
                )}
              </>
            }
          />
        </>
      )}
    </>
  );
};

export default PatientDetailPage;
