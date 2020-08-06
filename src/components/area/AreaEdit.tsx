import React from "react";
import { IArea } from "../../models/IArea";
import CenterLayout from "../../layouts/CenterLayout";
import { useForm } from "react-hook-form";

interface IAreaEditProps {
  currentArea: IArea;
  onEditArea(area: IArea): void;
}

type Inputs = {
  name: string;
  description: string;
};

const AreaEdit: React.FunctionComponent<IAreaEditProps> = ({
  currentArea,
  onEditArea,
}) => {
  const { register, handleSubmit, errors } = useForm<Inputs>();

  const onSubmit = (data: Inputs) => {
    const area: IArea = {
      name: data.name,
      description: data.description,
      state: true,
    };
    onEditArea(area);
  };

  return (
    <CenterLayout
      title={`Editar área de examen: "${currentArea.name}"`}
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
              defaultValue={currentArea.name}
            />
            <span className="input-hint">
              {!!errors.name
                ? errors.name.message
                : "Por favor ingrese el nuevo nombre del área de examen"}
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
              defaultValue={currentArea.description}
            />
            <span className="input-hint">
              {!!errors.description
                ? errors.description.message
                : "Por favor ingrese la nueva descripción del área de examen"}
            </span>
          </div>
          <div className="mx-1 my-4">
            <button className="btn btn-warning m-auto" type="submit">
              <span className="material-icons">update</span>Actualizar Área
            </button>
          </div>
        </form>
      }
    />
  );
};

export default AreaEdit;
