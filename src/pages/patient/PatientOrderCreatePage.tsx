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
import { IUser } from "../../models/IUser";
import { IOrder } from "../../models/IOrder";
import { toast } from "react-toastify";
import { ITest } from "../../models/ITest";
import { IProfile } from "../../models/IProfile";
import { IOrderTest } from "../../models/IOrderTest";
import { IOrderProfile } from "../../models/IOrderProfile";
import { IProfileTest } from "../../models/IProfileTest";
import OrderCreate from "../../components/order/OrderCreate";
import { ERol } from "../../models/ERol";

const PatientOrderCreatePage: React.FunctionComponent = () => {
  const { id } = useParams();
  const history = useHistory();
  const firestore = useFirestore();

  useFirestoreConnect(() => [
    { collection: "patients", doc: id },
    { collection: "tests", where: [["state", "==", true]] },
    { collection: "profiles", where: [["state", "==", true]] },
    { collection: "profile_tests", where: [["state", "==", true]] },
  ]);

  const currentPatient: IPatient = useSelector(
    ({ firestore: { data } }: any) => data.patients && data.patients[id]
  );

  const currentUser: IUser = useSelector(
    (state: any) => state.firebase.profile
  );

  const tests: ITest[] = useSelector(
    (state: any) => state.firestore.ordered.tests
  );

  const profiles: IProfile[] = useSelector(
    (state: any) => state.firestore.ordered.profiles
  );

  const profile_tests: IProfileTest[] = useSelector(
    (state: any) => state.firestore.ordered.profile_tests
  );

  const navigateToPatientManagement = () => {
    history.push("/user-panel");
  };

  const navigateToPatientOrderManagement = () => {
    history.push(`/user-panel/patients/${id}`);
  };

  const onCreateOrder = (
    order: IOrder,
    tests: ITest[],
    profiles: IProfile[]
  ) => {
    if (tests.length + profiles.length > 0) {
      order.user = currentUser.uid;
      toast.info("Procesando... por favor espere...");
      firestore
        .collection("orders")
        .add(order)
        .then(async (result) => {
          toast.success(`Nueva orden creada con id:${result.id}`);
          for (let i = 0; i < tests.length; i++) {
            const order_test: IOrderTest = {
              order: result.id,
              test: tests[i].id as string,
              state: tests[i].state,
              cost: Number.parseFloat(tests[i].cost.toString()),
            };
            await firestore
              .collection("order_tests")
              .doc(`${result.id}_${tests[i].id}`)
              .set(order_test)
              .then(() =>
                toast.success(`Examen "${tests[i].name}" agregado a la orden`)
              );
          }
          for (let i = 0; i < profiles.length; i++) {
            const order_profile: IOrderProfile = {
              order: result.id,
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
              .doc(`${result.id}_${profiles[i].id}`)
              .set(order_profile)
              .then(() =>
                toast.success(
                  `Perfil "${profiles[i].name}" agregado a la orden`
                )
              );
          }
          history.push(`/user-panel/patients/${id}`);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } else {
      toast.error("Debe seleccionar al menos un examen o perfil...");
    }
  };

  return (
    <>
      {!isLoaded(tests) ||
      !isLoaded(profiles) ||
      !isLoaded(profile_tests) ||
      !isLoaded(currentUser) ||
      !isLoaded(currentPatient) ? (
        <p className="m-2 text-center">Cargando exámenes y perfiles...</p>
      ) : (isEmpty(tests) && isEmpty(profiles)) || isEmpty(currentPatient) ? (
        <div className="flex flex-col justify-center">
          <p className="m-2 text-center font-code">
            ¡No puede crear una orden porque aún no existen exámenes ni
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
        <OrderCreate
          patient={{ id, ...currentPatient }}
          tests={tests}
          profiles={profiles.filter(
            (profile) =>
              profile_tests.filter((pt) => pt.profile === profile.id).length > 0
          )}
          profile_tests={profile_tests}
          rol={ERol.Public}
          onCreateOrder={onCreateOrder}
        />
      )}
    </>
  );
};

export default PatientOrderCreatePage;
