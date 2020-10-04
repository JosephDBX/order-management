import React from "react";
import { useSelector } from "react-redux";
import {
  isEmpty,
  isLoaded,
  useFirestore,
  useFirestoreConnect,
} from "react-redux-firebase";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import OrderManagement from "../../components/order/OrderManagement";
import PatientDetail from "../../components/patient/PatientDetail";
import MainDetailLayout from "../../layouts/MainDetailLayout";
import { ERol } from "../../models/ERol";
import { IOrder } from "../../models/IOrder";
import { IOrderProfile } from "../../models/IOrderProfile";
import { IOrderTest } from "../../models/IOrderTest";
import { IPatient } from "../../models/IPatient";
import { IProfile } from "../../models/IProfile";
import { ITest } from "../../models/ITest";
import { IUser } from "../../models/IUser";

const ReceptionistPatientDetailPage: React.FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const firestore = useFirestore();
  useFirestoreConnect(() => [
    { collection: "patients", doc: id },
    { collection: "orders", where: [["patient", "==", id]] },
    { collection: "order_tests" },
    { collection: "order_profiles" },
    { collection: "tests" },
    { collection: "profiles" },
    { collection: "users", where: [["roles.isDoctor", "==", true]] },
  ]);

  const currentPatient: IPatient = useSelector(
    ({ firestore: { data } }: any) => data.patients && data.patients[id]
  );
  const orders: IOrder[] = useSelector(
    (state: any) => state.firestore.ordered.orders
  );
  const orderTests: IOrderTest[] = useSelector(
    (state: any) => state.firestore.ordered.order_tests
  );
  const orderProfiles: IOrderProfile[] = useSelector(
    (state: any) => state.firestore.ordered.order_profiles
  );
  const tests: ITest[] = useSelector(
    (state: any) => state.firestore.ordered.tests
  );
  const profiles: IProfile[] = useSelector(
    (state: any) => state.firestore.ordered.profiles
  );
  const users: IUser[] = useSelector(
    (state: any) => state.firestore.ordered.users
  );

  const navigateToPatientManagement = () => {
    history.push("/receptionist-panel/patients");
  };

  const onOrderStateChange = (id: string, state: string) => {
    toast.info("Procesando... por favor espere...");
    if (state === "delete") {
      if (orders.find((o) => o.id === id)?.state === "pending") {
        firestore
          .collection("orders")
          .doc(id)
          .delete()
          .then(async () => {
            await orderTests
              .filter((ot) => ot.order === id)
              .forEach(async (ot) => {
                await firestore.collection("order_tests").doc(ot.id).delete();
              });
            await orderProfiles
              .filter((op) => op.order === id)
              .forEach(async (op) => {
                await firestore
                  .collection("order_profiles")
                  .doc(op.id)
                  .delete();
              });
            toast.success(`Orden con id:${id}, eliminada exitosamente`);
          })
          .catch((error) => {
            toast.error(error);
          });
      } else {
        toast.error("Solo puede eliminar una orden si está Pendiente");
      }
    } else {
      firestore
        .collection("orders")
        .doc(id)
        .set({ state }, { merge: true })
        .then(() => {
          toast.success(
            `Estado de la orden con id:${id}, actualizado exitosamente`
          );
        })
        .catch((error) => toast.error(error));
    }
  };

  return (
    <>
      {!isLoaded(currentPatient) ||
      !isLoaded(orders) ||
      !isLoaded(orderTests) ||
      !isLoaded(orderProfiles) ||
      !isLoaded(tests) ||
      !isLoaded(profiles) ||
      !isLoaded(users) ? (
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
                rol={ERol.Receptionist}
                isMain
                orders={orders}
              />
            }
            detail={
              <>
                {!isLoaded(orders) ? (
                  <p className="m-2 text-center">Cargando órdenes...</p>
                ) : (
                  <OrderManagement
                    rol={ERol.Receptionist}
                    patients={[{ id, ...currentPatient }]}
                    orders={orders}
                    orderTests={orderTests}
                    orderProfiles={orderProfiles}
                    tests={tests}
                    profiles={profiles}
                    doctors={users}
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

export default ReceptionistPatientDetailPage;
