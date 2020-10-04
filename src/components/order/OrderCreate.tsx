import React, { useState, useEffect } from "react";
import { ITest } from "../../models/ITest";
import { IProfile } from "../../models/IProfile";
import { IOrder } from "../../models/IOrder";
import { IPatient } from "../../models/IPatient";
import { IProfileTest } from "../../models/IProfileTest";
import { useForm } from "react-hook-form";
import moment from "moment";
import { ERol } from "../../models/ERol";
import CenterLayout from "../../layouts/CenterLayout";
import SelectListLayout from "../../layouts/SelectListLayout";
import SelectItemLayout from "../../layouts/SelectItemLayout";
import ModalLayout from "../../layouts/ModalLayout";
import TestControl from "../test/TestControl";
import ProfileControl from "../profile/ProfileControl";
import DateInput from "../custom/DateInput";
import { IUser } from "../../models/IUser";
import UserControl from "../user/UserControl";

interface IOrderCreateProps {
  patient: IPatient;
  tests: ITest[];
  profiles: IProfile[];
  profile_tests: IProfileTest[];
  rol: ERol;
  doctors: IUser[];
  onCreateOrder(order: IOrder, tests: ITest[], profiles: IProfile[]): void;
}

type Inputs = {
  delivery?: number;
  subTotal: number;
  discount?: number;
  description?: string;
};

const OrderCreate: React.FunctionComponent<IOrderCreateProps> = ({
  patient,
  tests,
  profiles,
  profile_tests = [],
  doctors,
  rol,
  onCreateOrder,
}) => {
  const { register, handleSubmit, errors, watch } = useForm<Inputs>();

  const [orderedTo, setOrderedTo] = useState(
    moment()
      .set({ hours: 5, minutes: 0, seconds: 0, milliseconds: 0 })
      .add({ days: 1 })
      .toDate()
  );

  const [modalDoctor, setModalDoctor] = useState(false);
  const onOpenModalDoctor = () => {
    setModalDoctor(true);
    onFilterTextDoctor(filterTextDoctor);
  };
  const onCloseModalDoctor = () => {
    setModalDoctor(false);
    setFilterTextDoctor("");
  };

  const [modalTest, setModalTest] = useState(false);
  const onOpenModalTest = () => {
    setModalTest(true);
    onFilterTextTest(filterTextTest);
  };
  const onCloseModalTest = () => {
    setModalTest(false);
    setFilterTextTest("");
  };

  const [modalProfile, setModalProfile] = useState(false);
  const onOpenModalProfile = () => {
    setModalProfile(true);
    onFilterTextProfile(filterTextProfile);
  };
  const onCloseModalProfile = () => {
    setModalProfile(false);
    setFilterTextProfile("");
  };

  const getSubTotal = () => {
    let sum: number = 0.0;
    selectedTests.forEach(
      (st) => (sum += Number.parseFloat(st.cost.toString()))
    );
    selectedProfiles.forEach(
      (sp) => (sum += Number.parseFloat(profileCost(sp)))
    );
    return sum.toFixed(2);
  };

  const getTotal = () => {
    let sum: number = 0.0;
    sum += Number.parseFloat(getSubTotal());
    if (rol === ERol.Receptionist) {
      sum += Number.parseFloat(watch("delivery")?.toString() as string);
      sum -= Number.parseFloat(watch("discount")?.toString() as string);
    } else {
      sum += 5;
    }
    return sum.toFixed(2);
  };

  // Doctor
  const [selectedDoctor, setSelectedDoctor] = useState<IUser>();
  const [listDoctor, setListDoctor] = useState<IUser[]>(doctors);
  const [filterTextDoctor, setFilterTextDoctor] = useState("");

  const onFilterTextDoctor = (filter: string) => {
    let aux = doctors.filter(
      (doctor) =>
        doctor.uid?.includes(filter) ||
        doctor.email?.toLowerCase().includes(filter.toLocaleLowerCase())
    );
    if (selectedDoctor) {
      aux = aux.filter((d) => d.id !== selectedDoctor.id);
    }
    setListDoctor(aux);
    setFilterTextDoctor(filter);
  };

  const onAddDoctor = (doctor: IUser) => {
    setSelectedDoctor(doctor);
    if (selectedDoctor) {
      setListDoctor(listDoctor.filter((d) => d.id !== selectedDoctor.id));
    }
    onCloseModalDoctor();
  };
  const onRemoveDoctor = (doctor: IUser) => {
    setListDoctor([...listDoctor, doctor]);
    setSelectedDoctor(undefined);
  };

  // Test
  const [selectedTests, setSelectedTests] = useState<ITest[]>([]);
  const [listTest, setListTest] = useState<ITest[]>(tests);
  const [filterTextTest, setFilterTextTest] = useState("");

  const onFilterTextTest = (filter: string) => {
    let aux = tests.filter(
      (test) =>
        test.name.toLowerCase().includes(filter.toLowerCase()) ||
        test.alternative?.toLowerCase().includes(filter.toLocaleLowerCase()) ||
        test.description.toLowerCase().includes(filter.toLowerCase())
    );
    selectedTests.forEach((s) => {
      aux = aux.filter((l) => l.id !== s.id);
    });
    setListTest(aux);
    setFilterTextTest(filter);
  };

  const onAddTest = (test: ITest) => {
    setSelectedTests([...selectedTests, test]);
    setListTest(listTest.filter((l) => l.id !== test.id));
    onCloseModalTest();
  };
  const onRemoveTest = (test: ITest) => {
    setListTest([...listTest, test]);
    setSelectedTests(selectedTests.filter((s) => s.id !== test.id));
  };

  // profile
  const [selectedProfiles, setSelectedProfiles] = useState<IProfile[]>([]);
  const [listProfile, setListProfile] = useState<IProfile[]>(profiles);
  const [filterTextProfile, setFilterTextProfile] = useState("");

  const onFilterTextProfile = (filter: string) => {
    let aux = profiles.filter(
      (profile) =>
        profile.name.toLowerCase().includes(filter.toLowerCase()) ||
        profile.alternative
          ?.toLowerCase()
          .includes(filter.toLocaleLowerCase()) ||
        profile.description.toLowerCase().includes(filter.toLowerCase())
    );
    selectedProfiles.forEach((s) => {
      aux = aux.filter((l) => l.id !== s.id);
    });
    setListProfile(aux);
    setFilterTextProfile(filter);
  };

  const onAddProfile = (profile: IProfile) => {
    setSelectedProfiles([...selectedProfiles, profile]);
    setListProfile(listProfile.filter((l) => l.id !== profile.id));
    onCloseModalProfile();
  };
  const onRemoveProfile = (profile: IProfile) => {
    setListProfile([...listProfile, profile]);
    setSelectedProfiles(selectedProfiles.filter((s) => s.id !== profile.id));
  };

  const onSubmit = (data: Inputs) => {
    const order: IOrder = {
      patient: patient.id as string,
      attendingDoctor: selectedDoctor ? selectedDoctor.uid : "",
      orderedTo: orderedTo.toISOString(),
      delivery:
        rol === ERol.Receptionist
          ? Number.parseFloat(data.delivery?.toString() as string)
          : 5,
      subTotal: Number.parseFloat(getSubTotal()),
      discount:
        rol === ERol.Receptionist
          ? Number.parseFloat(data.discount?.toString() as string)
          : 0,
      description: data.description,
      state: "pending",
    };
    onCreateOrder(order, selectedTests, selectedProfiles);
  };

  useEffect(() => {
    onFilterTextTest(filterTextTest);
  }, [tests]);
  useEffect(() => {
    onFilterTextProfile(filterTextProfile);
  }, [profiles]);
  useEffect(() => {
    onFilterTextDoctor(filterTextDoctor);
  }, [doctors]);

  const profileCost = (profile: IProfile) => {
    let sum: number = 0.0;
    profile_tests
      .filter((pt) => pt.profile === profile.id)
      .map((pt) => pt.cost)
      .forEach((pt) => (sum += Number.parseFloat(pt.toString())));
    return sum.toFixed(2);
  };

  return (
    <>
      <CenterLayout
        title={`Crear una nueva orden de examen para el paciente ${patient.name} ${patient.surname}`}
        subTitle="Asegúrese de que los contactos del paciente estén actualizados. El paciente será contactado un día antes de la visita."
        component={
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="my-4">
              <SelectListLayout
                title="Médico ordenando el examen"
                onAdd={onOpenModalDoctor}
                selected={
                  selectedDoctor &&
                  [selectedDoctor].map((d) => (
                    <SelectItemLayout
                      title={d?.userName as string}
                      subTitle={d?.email as string}
                      onAdd={() => onAddDoctor(d as IUser)}
                      onRemove={() => onRemoveDoctor(d as IUser)}
                      removable
                      key={d?.id}
                    />
                  ))
                }
              />
            </div>
            <div className="input-group">
              <label htmlFor="orderedTo" className="input-label">
                Fecha de la visita
              </label>
              <DateInput
                className="input input-primary w-full text-teal-500"
                currentDate={orderedTo}
                setCurrentDate={setOrderedTo}
                minDate={moment()
                  .set({ hours: 5, minutes: 0, seconds: 0, milliseconds: 0 })
                  .add({ days: 1 })
                  .toDate()}
                maxDate={moment()
                  .set({ hours: 9, minutes: 0, seconds: 0, milliseconds: 0 })
                  .add({ days: 31 })
                  .toDate()}
                isWeekday
                name="orderedTo"
                placeholder="Fecha de la visita al paciente"
                showTime
                includeTimes={[
                  moment().set({ hours: 5, minutes: 0 }).toDate(),
                  moment().set({ hours: 5, minutes: 30 }).toDate(),
                  moment().set({ hours: 6, minutes: 0 }).toDate(),
                  moment().set({ hours: 6, minutes: 30 }).toDate(),
                  moment().set({ hours: 7, minutes: 0 }).toDate(),
                  moment().set({ hours: 7, minutes: 30 }).toDate(),
                  moment().set({ hours: 8, minutes: 0 }).toDate(),
                  moment().set({ hours: 8, minutes: 30 }).toDate(),
                  moment().set({ hours: 9, minutes: 0 }).toDate(),
                ]}
              />
              <span className="input-hint">
                Por favor ingrese la fecha de visita al paciente
              </span>
            </div>
            <div className="my-4">
              <SelectListLayout
                title="Agregar exámenes a la orden"
                onAdd={onOpenModalTest}
                selected={selectedTests.map((test) => (
                  <SelectItemLayout
                    title={test.name}
                    subTitle={`USD $${test.cost}`}
                    onAdd={() => onAddTest(test)}
                    onRemove={() => onRemoveTest(test)}
                    removable
                    navigateTo={`/search/?test=${test.id}`}
                    key={test.id}
                  />
                ))}
              />
            </div>
            <div className="my-4">
              <SelectListLayout
                title="Agregar perfiles a la orden"
                onAdd={onOpenModalProfile}
                selected={selectedProfiles.map((profile) => (
                  <SelectItemLayout
                    title={profile.name}
                    subTitle={`USD $${profileCost(profile)}`}
                    onAdd={() => onAddProfile(profile)}
                    onRemove={() => onRemoveProfile(profile)}
                    removable
                    navigateTo={`/search/?profile=${profile.id}`}
                    key={profile.id}
                  />
                ))}
              />
            </div>
            <hr className="my-4" />
            <div className="flex flex-col font-semibold">
              <div className="flex flex-row justify-between text-teal-700">
                <div>Subtotal</div>
                <div>USD ${getSubTotal()}</div>
              </div>
              {rol === ERol.Receptionist ? (
                <div
                  className={`input-group ${
                    !!errors.delivery && "input-group-danger"
                  }`}
                >
                  <label htmlFor="name" className="input-label">
                    Costo del servicio a domicilio
                  </label>
                  <input
                    className="input input-primary"
                    type="number"
                    name="delivery"
                    placeholder="Servicio a domicilio"
                    defaultValue={5}
                    min={0}
                    step={0.01}
                    ref={register({
                      required: {
                        value: true,
                        message:
                          "El costo del servicio a domicilio es requerido",
                      },
                    })}
                  />
                  <span className="input-hint">
                    {!!errors.delivery
                      ? errors.delivery.message
                      : "Por favor ingrese el costo del servicio a domicilio de la nueva orden"}
                  </span>
                </div>
              ) : (
                <div className="flex flex-row justify-between text-gray-700">
                  <div>Costo del servicio a domicilio</div>
                  <div>USD $5.00</div>
                </div>
              )}
              {rol === ERol.Receptionist ? (
                <div
                  className={`input-group ${
                    !!errors.discount && "input-group-danger"
                  }`}
                >
                  <label htmlFor="name" className="input-label">
                    Descuento
                  </label>
                  <input
                    className="input input-primary"
                    type="number"
                    name="discount"
                    placeholder="Descuento al servicio"
                    defaultValue={0}
                    min={0}
                    step={0.01}
                    ref={register}
                  />
                  <span className="input-hint">Hacer un descuento</span>
                </div>
              ) : null}
              <div>
                <hr />
              </div>
              <div className="flex flex-row justify-between text-blue-700 font-bold">
                <div>Total</div>
                <div>USD ${getTotal()}</div>
              </div>
              <div>
                <hr />
              </div>
            </div>
            <div
              className={`input-group my-8 ${
                !!errors.description && "input-group-danger"
              }`}
            >
              <label htmlFor="description" className="input-label">
                Método de pago y otros datos
              </label>
              <textarea
                className="input input-primary"
                name="description"
                placeholder="Método de pago"
                ref={register({
                  required: {
                    value: true,
                    message: "Método de pago y otros datos es requerido",
                  },
                })}
              />
              <span className="input-hint">
                {!!errors.description
                  ? errors.description.message
                  : "Por ejemplo: 'Tarjeta' o la 'denominación del billete' y otra información que estime pertinente"}
              </span>
            </div>
            <div className="mx-1 my-4">
              <button className="btn btn-primary m-auto" type="submit">
                <span className="material-icons">add_circle</span>Crear Orden
              </button>
            </div>
          </form>
        }
      />
      <ModalLayout
        title="Médico ordenando el examen"
        open={modalDoctor}
        component={
          <>
            <UserControl rol={ERol.Public} onFilter={onFilterTextDoctor} />
            <div className="frame" style={{ maxHeight: "16rem" }}>
              {listDoctor.map((d) => (
                <SelectItemLayout
                  title={d?.userName as string}
                  subTitle={d?.email as string}
                  onAdd={() => onAddDoctor(d as IUser)}
                  onRemove={() => onRemoveDoctor(d as IUser)}
                  key={d?.id}
                />
              ))}
            </div>
          </>
        }
        onClose={onCloseModalDoctor}
      />
      <ModalLayout
        title="Agregar exámenes a la orden"
        open={modalTest}
        component={
          <>
            <TestControl rol={ERol.Public} onFilterText={onFilterTextTest} />
            <div className="frame" style={{ maxHeight: "16rem" }}>
              {listTest.map((test) => (
                <SelectItemLayout
                  title={test.name}
                  subTitle={`USD $${test.cost}`}
                  onAdd={() => onAddTest(test)}
                  onRemove={() => onRemoveTest(test)}
                  navigateTo={`/search/?test=${test.id}`}
                  key={test.id}
                />
              ))}
            </div>
          </>
        }
        onClose={onCloseModalTest}
      />
      <ModalLayout
        title="Agregar perfiles a la orden"
        open={modalProfile}
        component={
          <>
            <ProfileControl
              rol={ERol.Public}
              onFilterText={onFilterTextProfile}
            />
            <div className="frame" style={{ maxHeight: "16rem" }}>
              {listProfile.map((profile) => (
                <SelectItemLayout
                  title={profile.name}
                  subTitle={`USD $${profileCost(profile)}`}
                  onAdd={() => onAddProfile(profile)}
                  onRemove={() => onRemoveProfile(profile)}
                  navigateTo={`/search/?profile=${profile.id}`}
                  key={profile.id}
                />
              ))}
            </div>
          </>
        }
        onClose={onCloseModalProfile}
      />
    </>
  );
};

export default OrderCreate;
