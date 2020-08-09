import React from "react";
import { ITest } from "../../models/ITest";
import { IArea } from "../../models/IArea";
import { useForm } from "react-hook-form";
import CenterLayout from "../../layouts/CenterLayout";

interface ITestEditProps {
  currentArea: IArea;
  currentTest: ITest;
  onEditTest(test: ITest): void;
}

type Inputs = {
  name: string;
  alternative: string;
  cost: number;
  description: string;
};

const TestEdit: React.FunctionComponent<ITestEditProps> = ({
  currentArea,
  currentTest,
  onEditTest,
}) => {
  const { register, handleSubmit, errors } = useForm<Inputs>();

  const onSubmit = (data: Inputs) => {
    const test: ITest = {
      area: currentArea.id as string,
      ...data,
      state: currentArea.state,
    };
    onEditTest(test);
  };

  return (
    <CenterLayout
      title={`Editar examen ${currentTest.name} para el área de ${currentArea.name}`}
      component={
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className={`input-group ${!!errors.name && "input-group-danger"}`}
          >
            <label htmlFor="name" className="input-label">
              Nombre del examen
            </label>
            <input
              className="input input-primary"
              type="text"
              name="name"
              placeholder="Nombre del examen"
              defaultValue={currentTest.name}
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
                : "Por favor ingrese el nuevo nombre del examen"}
            </span>
          </div>
          <div className="input-group">
            <label htmlFor="alternative" className="input-label">
              Nombres alternativos del examen
            </label>
            <textarea
              className="input input-primary"
              name="alternative"
              placeholder="Nombres alternativos del examen"
              defaultValue={currentTest.alternative}
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
              defaultValue={currentTest.cost}
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
                : "Por favor ingrese el nuevo costo del examen en USD$"}
            </span>
          </div>
          <div
            className={`input-group ${
              !!errors.description && "input-group-danger"
            }`}
          >
            <label htmlFor="description" className="input-label">
              Descripción del examen
            </label>
            <textarea
              className="input input-primary"
              name="description"
              placeholder="Descripción del examen"
              defaultValue={currentTest.description}
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
                : "Por favor ingrese la nueva descripción del examen"}
            </span>
          </div>
          <div className="mx-1 my-4">
            <button className="btn btn-warning m-auto" type="submit">
              <span className="material-icons">update</span>Actualizar Examen
            </button>
          </div>
        </form>
      }
    />
  );
};

export default TestEdit;
