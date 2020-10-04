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
import OrderCreate from "../../components/order/OrderCreate";
import { ERol } from "../../models/ERol";
import { IOrder } from "../../models/IOrder";
import { IOrderProfile } from "../../models/IOrderProfile";
import { IOrderTest } from "../../models/IOrderTest";
import { IPatient } from "../../models/IPatient";
import { IProfile } from "../../models/IProfile";
import { IProfileTest } from "../../models/IProfileTest";
import { ITest } from "../../models/ITest";
import { IUser } from "../../models/IUser";
import { IUserPatient } from "../../models/IUserPatient";

const ReceptionistOrderCreatePage: React.FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const firestore = useFirestore();

  const [isLoading, setIsLoading] = useState(false);

  useFirestoreConnect(() => [
    { collection: "patients", doc: id },
    { collection: "tests", where: [["state", "==", true]] },
    { collection: "profiles", where: [["state", "==", true]] },
    { collection: "profile_tests", where: [["state", "==", true]] },
    { collection: "users", where: [["roles.isDoctor", "==", true]] },
    { collection: "user_patients", where: [["patient", "==", id]] },
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

  const users: IUser[] = useSelector(
    (state: any) => state.firestore.ordered.users
  );

  const user_patients: IUserPatient[] = useSelector(
    (state: any) => state.firestore.ordered.user_patients
  );

  const navigateToPatientManagement = () => {
    history.push("/receptionist-panel/patients");
  };

  const navigateToPatientOrderManagement = () => {
    history.push(`/receptionist-panel/patients/${id}`);
  };

  const onCreateOrder = (
    order: IOrder,
    tests: ITest[],
    profiles: IProfile[]
  ) => {
    if (tests.length + profiles.length > 0) {
      order.user = currentUser.uid;
      setIsLoading(true);
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
          history.push(`/receptionist-panel/patients/${id}`);
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
      !isLoaded(profiles) ||
      !isLoaded(profile_tests) ||
      !isLoaded(currentUser) ||
      !isLoaded(currentPatient) ||
      !isLoaded(users) ||
      !isLoaded(user_patients) ? (
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
          rol={ERol.Receptionist}
          doctors={users.filter(
            (u) =>
              user_patients.filter(
                (up) => up.patient === id && up.user === u.id
              ).length > 0
          )}
          onCreateOrder={onCreateOrder}
        />
      )}
      <Loading isLoading={isLoading} />
    </>
  );
};

export default ReceptionistOrderCreatePage;
