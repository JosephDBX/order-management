import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  isEmpty,
  isLoaded,
  useFirestore,
  useFirestoreConnect,
} from "react-redux-firebase";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../components/custom/Loading";
import OrderEdit from "../../components/order/OrderEdit";
import { ERol } from "../../models/ERol";
import { IOrder } from "../../models/IOrder";
import { IOrderProfile } from "../../models/IOrderProfile";
import { IOrderTest } from "../../models/IOrderTest";
import { IPatient } from "../../models/IPatient";
import { IProfile } from "../../models/IProfile";
import { IProfileTest } from "../../models/IProfileTest";
import { ITest } from "../../models/ITest";
import { IUser } from "../../models/IUser";

const PatientOrderEditPage: React.FunctionComponent = () => {
  const { idPatient, idOrder } = useParams<{
    idPatient: string;
    idOrder: string;
  }>();
  const history = useHistory();
  const firestore = useFirestore();

  const [isLoading, setIsLoading] = useState(false);

  useFirestoreConnect(() => [
    { collection: "patients", doc: idPatient },
    { collection: "orders", doc: idOrder },
    { collection: "tests", where: [["state", "==", true]] },
    { collection: "order_tests", where: [["order", "==", idOrder]] },
    { collection: "profiles", where: [["state", "==", true]] },
    { collection: "order_profiles", where: [["order", "==", idOrder]] },
    { collection: "profile_tests", where: [["state", "==", true]] },
  ]);

  const currentPatient: IPatient = useSelector(
    ({ firestore: { data } }: any) => data.patients && data.patients[idPatient]
  );

  const currentOrder: IOrder = useSelector(
    ({ firestore: { data } }: any) => data.orders && data.orders[idOrder]
  );

  const currentUser: IUser = useSelector(
    (state: any) => state.firebase.profile
  );

  const tests: ITest[] = useSelector(
    (state: any) => state.firestore.ordered.tests
  );

  const order_tests: IOrderTest[] = useSelector(
    (state: any) => state.firestore.ordered.order_tests
  );

  const profiles: IProfile[] = useSelector(
    (state: any) => state.firestore.ordered.profiles
  );

  const order_profiles: IOrderProfile[] = useSelector(
    (state: any) => state.firestore.ordered.order_profiles
  );

  const profile_tests: IProfileTest[] = useSelector(
    (state: any) => state.firestore.ordered.profile_tests
  );

  const navigateToPatientManagement = () => {
    history.push("/user-panel");
  };

  const navigateToPatientOrderManagement = () => {
    history.push(`/user-panel/patients/${idPatient}`);
  };

  const onEditOrder = (order: IOrder, tests: ITest[], profiles: IProfile[]) => {
    if (tests.length + profiles.length > 0) {
      order.user = currentUser.uid;
      setIsLoading(true);
      toast.info("Procesando... por favor espere...");
      firestore
        .collection("orders")
        .doc(idOrder)
        .set(order, { merge: true })
        .then(async () => {
          toast.success(`Orden con id:${idOrder}, actualizada exitosamente`);
          for (let i = 0; i < order_tests.length; i++) {
            await firestore
              .collection("order_tests")
              .doc(order_tests[i].id)
              .delete();
          }
          for (let i = 0; i < tests.length; i++) {
            const order_test: IOrderTest = {
              order: idOrder,
              test: tests[i].id as string,
              state: tests[i].state,
              cost: Number.parseFloat(tests[i].cost.toString()),
            };
            await firestore
              .collection("order_tests")
              .doc(`${idOrder}_${tests[i].id}`)
              .set(order_test)
              .then(() =>
                toast.success(`Examen "${tests[i].name}" agregado a la orden`)
              );
          }
          for (let i = 0; i < order_profiles.length; i++) {
            await firestore
              .collection("order_profiles")
              .doc(order_profiles[i].id)
              .delete();
          }
          for (let i = 0; i < profiles.length; i++) {
            const order_profile: IOrderProfile = {
              order: idOrder,
              profile: profiles[i].id as string,
              state: profiles[i].state,
              cost: profile_tests
                .filter((pt) => pt.profile === profiles[i].id)
                .map((pt) => pt.cost)
                .reduce(
                  (previous, current) =>
                    Number.parseFloat(previous.toString()) +
                    Number.parseFloat(current.toString())
                ),
            };
            await firestore
              .collection("order_profiles")
              .doc(`${idOrder}_${profiles[i].id}`)
              .set(order_profile)
              .then(() =>
                toast.success(
                  `Perfil "${profiles[i].name}" agregado a la orden`
                )
              );
          }
          history.push(`/user-panel/patients/${idPatient}`);
        })
        .catch((error) => {
          setIsLoading(false);
          toast.error(error.message);
        });
    } else {
      toast.error("Debe seleccionar al menos un examen o perfil...");
    }
  };

  return (
    <>
      {!isLoaded(tests) ||
      !isLoaded(order_tests) ||
      !isLoaded(profiles) ||
      !isLoaded(order_profiles) ||
      !isLoaded(profile_tests) ||
      !isLoaded(currentUser) ||
      !isLoaded(currentOrder) ||
      !isLoaded(currentPatient) ? (
        <p className="m-2 text-center">Cargando exámenes y perfiles...</p>
      ) : (isEmpty(tests) && isEmpty(profiles)) ||
        isEmpty(currentPatient) ||
        isEmpty(currentOrder) ||
        (isEmpty(order_tests) && isEmpty(order_profiles)) ? (
        <div className="flex flex-col justify-center">
          <p className="m-2 text-center font-code">
            ¡No puede editar una orden porque aún no existen exámenes ni
            perfiles!
          </p>
          <button
            className="btn btn-secondary my-4 mx-auto"
            onClick={
              isEmpty(currentPatient)
                ? navigateToPatientManagement
                : navigateToPatientOrderManagement
            }
          >
            <span className="material-icons">arrow_back</span>
            {isEmpty(currentPatient)
              ? "Regresar a la gestión de pacientes"
              : "Regresar a la gestión de ordenes"}
          </button>
        </div>
      ) : (
        <OrderEdit
          patient={{ id: idPatient, ...currentPatient }}
          order={{ id: idOrder, ...currentOrder }}
          tests={tests}
          selected_tests={order_tests}
          profiles={profiles.filter(
            (profile) =>
              profile_tests.filter((pt) => pt.profile === profile.id).length > 0
          )}
          selected_profiles={order_profiles}
          profile_tests={profile_tests}
          rol={ERol.Public}
          onEditOrder={onEditOrder}
        />
      )}
      <Loading isLoading={isLoading} />
    </>
  );
};

export default PatientOrderEditPage;
