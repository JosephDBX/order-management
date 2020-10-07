import React from "react";
import { useSelector } from "react-redux";
import {
  isLoaded,
  useFirestore,
  useFirestoreConnect,
} from "react-redux-firebase";
import { toast } from "react-toastify";
import OrderManagement from "../../components/order/OrderManagement";
import { ERol } from "../../models/ERol";
import { IOrder } from "../../models/IOrder";
import { IOrderProfile } from "../../models/IOrderProfile";
import { IOrderTest } from "../../models/IOrderTest";
import { IPatient } from "../../models/IPatient";
import { IProfile } from "../../models/IProfile";
import { ITest } from "../../models/ITest";
import { IUser } from "../../models/IUser";

const DeliveryWorkerPanel: React.FunctionComponent = () => {
  const firestore = useFirestore();
  useFirestoreConnect(() => [
    { collection: "patients" },
    { collection: "orders", where: [["state", "==", "pending"]] },
    { collection: "order_tests" },
    { collection: "order_profiles" },
    { collection: "tests" },
    { collection: "profiles" },
    { collection: "users", where: [["roles.isDoctor", "==", true]] },
  ]);

  const patients: IPatient[] = useSelector(
    (state: any) => state.firestore.ordered.patients
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
      {!isLoaded(patients) ||
      !isLoaded(orders) ||
      !isLoaded(orderTests) ||
      !isLoaded(orderProfiles) ||
      !isLoaded(tests) ||
      !isLoaded(profiles) ||
      !isLoaded(users) ? (
        <p className="m-2 text-center">Cargando ordenes...</p>
      ) : (
        <>
          <OrderManagement
            rol={ERol.DeliveryWorker}
            patients={patients}
            orders={orders}
            orderTests={orderTests}
            orderProfiles={orderProfiles}
            tests={tests}
            profiles={profiles}
            doctors={users}
            isFull={true}
            onOrderStateChange={onOrderStateChange}
          />
        </>
      )}
    </>
  );
};

export default DeliveryWorkerPanel;
