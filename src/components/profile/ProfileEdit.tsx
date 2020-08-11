import React from "react";
import { useForm } from "react-hook-form";
import { IProfile } from "../../models/IProfile";
import CenterLayout from "../../layouts/CenterLayout";

interface IProfileEditProps {
  currentProfile: IProfile;
  onEditProfile(profile: IProfile): void;
}

type Inputs = {
  name: string;
  alternative: string;
  description: string;
};

const ProfileEdit: React.FunctionComponent<IProfileEditProps> = ({
  currentProfile,
  onEditProfile,
}) => {
  const { register, handleSubmit, errors } = useForm<Inputs>();

  const onSubmit = (data: Inputs) => {
    const profile: IProfile = {
      ...data,
      state: true,
    };
    onEditProfile(profile);
  };
  return (
    <CenterLayout
      title={`Editar perfil de examen: "${currentProfile.name}"`}
      component={
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className={`input-group ${!!errors.name && "input-group-danger"}`}
          >
            <label htmlFor="name" className="input-label">
              Nombre del perfil
            </label>
            <input
              className="input input-primary"
              type="text"
              name="name"
              placeholder="Nombre del perfil"
              defaultValue={currentProfile.name}
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
                : "Por favor ingrese el nuevo nombre del perfil"}
            </span>
          </div>
          <div className="input-group">
            <label htmlFor="alternative" className="input-label">
              Nombres alternativos del perfil
            </label>
            <textarea
              className="input input-primary"
              name="alternative"
              placeholder="Nombres alternativos del perfil"
              defaultValue={currentProfile.alternative}
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
              Descripción del perfil
            </label>
            <textarea
              className="input input-primary"
              name="description"
              placeholder="Descripción del perfil"
              defaultValue={currentProfile.description}
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
                : "Por favor ingrese la nueva descripción del perfil"}
            </span>
          </div>
          <div className="mx-1 my-4">
            <button className="btn btn-warning m-auto" type="submit">
              <span className="material-icons">update</span>Actualizar Perfil
            </button>
          </div>
        </form>
      }
    />
  );
};

export default ProfileEdit;
