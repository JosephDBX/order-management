import React, { useState, useEffect } from "react";
import { IProfile } from "../../models/IProfile";
import { useForm } from "react-hook-form";
import CenterLayout from "../../layouts/CenterLayout";
import SelectListLayout from "../../layouts/SelectListLayout";
import { ITest } from "../../models/ITest";
import ModalLayout from "../../layouts/ModalLayout";
import TestControl from "../test/TestControl";
import { ERol } from "../../models/ERol";
import SelectItemLayout from "../../layouts/SelectItemLayout";

interface IProfileCreateProps {
  tests: ITest[];
  onCreateProfile(profile: IProfile, tests: ITest[]): void;
}

type Inputs = {
  name: string;
  alternative: string;
  description: string;
};

const ProfileCreate: React.FunctionComponent<IProfileCreateProps> = ({
  tests,
  onCreateProfile,
}) => {
  const { register, handleSubmit, errors } = useForm<Inputs>();

  const onSubmit = (data: Inputs) => {
    const profile: IProfile = {
      ...data,
      state: true,
    };
    onCreateProfile(profile, selected);
  };

  const [modal, setModal] = useState(false);
  const onOpenModal = () => {
    setModal(true);
  };
  const onCloseModal = () => {
    setModal(false);
  };

  const [selected, setSelected] = useState<ITest[]>([]);

  const onAdd = (test: ITest) => {
    setSelected([...selected, test]);
    onFilterText("");
    setList(list.filter((l) => l.id !== test.id));
    onCloseModal();
  };
  const onRemove = (test: ITest) => {
    setList([...list, test]);
    setSelected(selected.filter((s) => s.id !== test.id));
  };

  const [list, setList] = useState<ITest[]>(tests);
  const [filterText, setFilterText] = useState("");

  const onFilterText = (filter: string) => {
    let aux = tests.filter(
      (test) =>
        test.name.toLowerCase().includes(filter.toLowerCase()) ||
        test.alternative?.toLowerCase().includes(filter.toLocaleLowerCase()) ||
        test.description.toLowerCase().includes(filter.toLowerCase())
    );
    selected.forEach((s) => {
      aux = aux.filter((l) => l.id !== s.id);
    });
    setList(aux);
    setFilterText(filter);
  };

  const getTotal = () => {
    let sum: number = 0.0;
    selected.forEach((s) => {
      sum += Number.parseFloat(s.cost.toString());
    });
    return sum.toFixed(2);
  };

  useEffect(() => {
    onFilterText(filterText);
  }, [tests]);

  return (
    <>
      <CenterLayout
        title="Crear un nuevo perfil de examen"
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
            <div className="flex flex-row justify-between text-blue-700 font-bold">
              <div>Total</div>
              <div>USD ${getTotal()}</div>
            </div>
            <hr />
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

export default ProfileCreate;
