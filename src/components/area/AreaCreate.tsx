import React from "react";
import CenterLayout from "../../layouts/CenterLayout";
import { useForm } from "react-hook-form";
import { IArea } from "../../models/IArea";

interface IAreaCreateProps {
  onCreateArea(area: IArea): void;
}

type Inputs = {
  name: string;
  description: string;
};

const AreaCreate: React.FunctionComponent<IAreaCreateProps> = ({
  onCreateArea,
}) => {
  const { register, handleSubmit, errors } = useForm<Inputs>();

  const onSubmit = (data: Inputs) => {
    const area: IArea = {
      name: data.name,
      description: data.description,
      state: true,
    };
    onCreateArea(area);
  };

  return (
    <CenterLayout
      title="Crear una nueva área de examen"
      component={
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className={`input-group ${!!errors.name && "input-group-danger"}`}
          >
            <label htmlFor="name" className="input-label">
              Nombre del área
            </label>
            <input
              className="input input-primary"
              type="text"
              name="name"
              placeholder="Nombre del área"
              ref={register({
                required: {
                  value: true,
                  message: "El nombre del área es requerido",
                },
              })}
            />
            <span className="input-hint">
              {!!errors.name
                ? errors.name.message
                : "Por favor ingrese el nombre de la nueva área de examen"}
            </span>
          </div>
          <div
            className={`input-group ${
              !!errors.description && "input-group-danger"
            }`}
          >
            <label htmlFor="description" className="input-label">
              Descripción del área
            </label>
            <textarea
              className="input input-primary"
              name="description"
              placeholder="Descripción del área"
              ref={register({
                required: {
                  value: true,
                  message: "La descripción del área es requerida",
                },
              })}
            />
            <span className="input-hint">
              {!!errors.description
                ? errors.description.message
                : "Por favor ingrese la descripción de la nueva área de examen"}
            </span>
          </div>
          <div className="mx-1 my-4">
            <button className="btn btn-primary m-auto" type="submit">
              <span className="material-icons">add_circle</span>Crear Área
            </button>
          </div>
        </form>
      }
    />
  );
};

export default AreaCreate;
