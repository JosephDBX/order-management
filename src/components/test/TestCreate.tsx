import React from "react";
import { ITest } from "../../models/ITest";
import CenterLayout from "../../layouts/CenterLayout";
import { IArea } from "../../models/IArea";
import { useForm } from "react-hook-form";

interface ITestCreateProps {
  area: IArea;
  onCreateTest(test: ITest): void;
}

type Inputs = {
  name: string;
  alternative: string;
  cost: number;
  description: string;
};

const TestCreate: React.FunctionComponent<ITestCreateProps> = ({
  area,
  onCreateTest,
}) => {
  const { register, handleSubmit, errors } = useForm<Inputs>();

  const onSubmit = (data: Inputs) => {
    const test: ITest = {
      area: area.id as string,
      ...data,
      cost: Number.parseFloat(data.cost.toString()),
      state: area.state,
    };
    onCreateTest(test);
  };

  return (
    <CenterLayout
      title={`Crear nuevo examen para el área de ${area.name}`}
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
              placeholder="Nombre del examen"
              ref={register({
                required: {
                  value: true,
                  message: "El nombre del examen es requerido",
                },
              })}
            />
            <span className="input-hint">
              {!!errors.name
                ? errors.name.message
                : "Por favor ingrese el nombre del nuevo examen"}
            </span>
          </div>
          <div className="input-group">
            <label htmlFor="alternative" className="input-label">
              Nombres alternativos
            </label>
            <textarea
              className="input input-primary"
              name="alternative"
              placeholder="Nombres alternativos del examen"
              ref={register}
            />
            <span className="input-hint">
              Ingrese los nombres alternativos en cada línea "⏎" para su fácil
              listado posterior
            </span>
          </div>
          <div
            className={`input-group ${!!errors.cost && "input-group-danger"}`}
          >
            <label htmlFor="cost" className="input-label">
              Costo del examen en USD$
            </label>
            <input
              className="input input-primary"
              type="number"
              name="cost"
              placeholder="Costo del examen"
              defaultValue={0}
              min={0}
              step={0.01}
              ref={register({
                required: {
                  value: true,
                  message: "El costo del examen es requerido",
                },
                min: {
                  value: 0.01,
                  message: 'El costo del examen debe ser mayor a cero "0"',
                },
              })}
            />
            <span className="input-hint">
              {!!errors.cost
                ? errors.cost.message
                : "Por favor ingrese el costo del nuevo examen en USD$"}
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
              placeholder="Descripción del examen"
              ref={register({
                required: {
                  value: true,
                  message: "La descripción del examen es requerida",
                },
              })}
            />
            <span className="input-hint">
              {!!errors.description
                ? errors.description.message
                : "Por favor ingrese la descripción del nuevo examen"}
            </span>
          </div>
          <div className="mx-1 my-4">
            <button className="btn btn-primary m-auto" type="submit">
              <span className="material-icons">add_circle</span>Crear Examen
            </button>
          </div>
        </form>
      }
    />
  );
};

export default TestCreate;
