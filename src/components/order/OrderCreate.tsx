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

interface IOrderCreateProps {
  patient: IPatient;
  tests: ITest[];
  profiles: IProfile[];
  profile_tests: IProfileTest[];
  rol: ERol;
  onCreateOrder(order: IOrder, tests: ITest[], profiles: IProfile[]): void;
}

type Inputs = {
  delivery?: number;
  subTotal: number;
  discount?: number;
  paymentType: string; // default "card"
  description?: string;
};

const OrderCreate: React.FunctionComponent<IOrderCreateProps> = ({
  patient,
  tests,
  profiles,
  profile_tests,
  rol,
  onCreateOrder,
}) => {
  const { register, handleSubmit, errors } = useForm<Inputs>();

  const [orderedTo, setOrderedTo] = useState(
    moment().set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }).toDate()
  );

  const [modalTest, setModalTest] = useState(false);
  const onOpenModalTest = () => {
    setModalTest(true);
  };
  const onCloseModalTest = () => {
    setModalTest(false);
  };

  const [modalProfile, setModalProfile] = useState(false);
  const onOpenModalProfile = () => {
    setModalProfile(true);
  };
  const onCloseModalProfile = () => {
    setModalProfile(false);
  };

  const getSubTotal = (): number => {
    return 0;
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
    onFilterTextTest("");
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
    onFilterTextProfile("");
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
      orderedTo: orderedTo.toISOString(),
      delivery: rol === ERol.Public ? 5 : data.delivery,
      subTotal: getSubTotal(),
      discount: rol === ERol.Public ? 0 : data.discount,
      paymentType: data.paymentType,
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

  return (
    <>
      <CenterLayout
        title={`Crear una nueva orden de examen para el paciente ${patient.name} ${patient.surname}`}
        component={
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              className={`input-group ${!!errors.name && "input-group-danger"}`}
            >
              <label htmlFor="name" className="input-label">
                Nombre
              </label>
              <input
                className="input input-primary"
                type="text"
                name="name"
                placeholder="Nombre del perfil"
                ref={register({
                  required: {
                    value: true,
                    message: "El nombre del perfil es requerido",
                  },
                })}
              />
              <span className="input-hint">
                {!!errors.name
                  ? errors.name.message
                  : "Por favor ingrese el nombre del nuevo perfil"}
              </span>
            </div>
            <div className="input-group">
              <label htmlFor="alternative" className="input-label">
                Nombres alternativos
              </label>
              <textarea
                className="input input-primary"
                name="alternative"
                placeholder="Nombres alternativos del perfil"
                ref={register}
              />
              <span className="input-hint">
                Ingrese los nombres alternativos en cada línea "⏎" para su fácil
                listado posterior
              </span>
            </div>
            <div
              className={`input-group ${
                !!errors.description && "input-group-danger"
              }`}
            >
              <label htmlFor="description" className="input-label">
                Descripción
              </label>
              <textarea
                className="input input-primary"
                name="description"
                placeholder="Descripción del perfil"
                ref={register({
                  required: {
                    value: true,
                    message: "La descripción del perfil es requerida",
                  },
                })}
              />
              <span className="input-hint">
                {!!errors.description
                  ? errors.description.message
                  : "Por favor ingrese la descripción del nuevo perfil"}
              </span>
            </div>
            <div className="my-8">
              <SelectListLayout
                title="Agregar exámenes al perfil"
                onAdd={onOpenModal}
                selected={selected.map((test) => (
                  <SelectItemLayout
                    title={test.name}
                    subTitle={`USD $${test.cost}`}
                    onAdd={() => onAdd(test)}
                    onRemove={() => onRemove(test)}
                    removable
                    navigateTo={`/admin-panel/areas/${test.area}`}
                    key={test.id}
                  />
                ))}
              />
            </div>
            <div className="mx-1 my-4">
              <button className="btn btn-primary m-auto" type="submit">
                <span className="material-icons">add_circle</span>Crear Perfil
              </button>
            </div>
          </form>
        }
      />
      <ModalLayout
        title="Agregar exámenes al perfil"
        open={modal}
        component={
          <>
            <TestControl rol={ERol.Public} onFilterText={onFilterText} />
            <div className="frame" style={{ maxHeight: "16rem" }}>
              {list.map((test) => (
                <SelectItemLayout
                  title={test.name}
                  subTitle={`USD $${test.cost}`}
                  onAdd={() => onAdd(test)}
                  onRemove={() => onRemove(test)}
                  navigateTo={`/admin-panel/areas/${test.area}`}
                  key={test.id}
                />
              ))}
            </div>
          </>
        }
        onClose={onCloseModal}
      />
    </>
  );
};

export default OrderCreate;
