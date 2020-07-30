import React, { BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import CenterLayout from "../../layouts/CenterLayout";

interface IUserCreateProps {
  onCreateUser(email: string, password: string): void;
}

type Inputs = {
  email: string;
  password: string;
  passwordRequired: string;
};

const UserCreate: React.FunctionComponent<IUserCreateProps> = ({
  onCreateUser,
}) => {
  const { register, handleSubmit, watch, errors } = useForm<Inputs>();

  const onSubmit = (
    data: Inputs,
    event: BaseSyntheticEvent<object, any, any> | undefined
  ) => {
    onCreateUser(data.email, data.password);
    event?.target.reset();
  };

  return (
    <CenterLayout
      title="Regístrese para obtener una cuenta gratuita"
      subTitle="¡Únete a LCBM! ¡No tomará tiempo!"
      component={
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className={`input-group my-2 ${
              !!errors.email && "input-group-danger"
            }`}
          >
            <label htmlFor="email" className="input-label">
              Correo electrónico
            </label>
            <input
              className="input input-primary"
              type="email"
              name="email"
              placeholder="Correo electrónico"
              ref={register({
                required: {
                  value: true,
                  message: "La dirección de correo electrónico es requerida",
                },
                pattern: {
                  value: /\S+@\S+\.\S+/i,
                  message:
                    "Por favor ingrese un formato de correo electrónico válido",
                },
              })}
            />
            <span className="input-hint">
              {!!errors.email
                ? errors.email.message
                : "Por favor ingrese su correo electrónico"}
            </span>
          </div>
          <div
            className={`input-group my-2 ${
              !!errors.password && "input-group-danger"
            }`}
          >
            <label htmlFor="password" className="input-label">
              Contraseña
            </label>
            <input
              className="input input-primary"
              type="password"
              name="password"
              placeholder="Contraseña"
              ref={register({
                required: {
                  value: true,
                  message: "La contraseña es requerida",
                },
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos seis dígitos",
                },
              })}
            />
            <span className="input-hint">
              {!!errors.password
                ? errors.password.message
                : "Por favor ingrese su contraseña"}
            </span>
          </div>
          <div
            className={`input-group my-2 ${
              !!errors.passwordRequired && "input-group-danger"
            }`}
          >
            <label htmlFor="passwordRequired" className="input-label">
              Confirmar contraseña
            </label>
            <input
              className="input input-primary"
              type="password"
              name="passwordRequired"
              placeholder="Confirmar contraseña"
              ref={register({
                required: {
                  value: true,
                  message: "La confirmación de contraseña es requerida",
                },
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos seis dígitos",
                },
                validate: {
                  mismatch: (value) => value === watch("password"),
                },
              })}
            />
            <span className="input-hint">
              {!!errors.passwordRequired
                ? errors.passwordRequired.type === "mismatch"
                  ? "La contraseña no coincide"
                  : errors.passwordRequired.message
                : "Por favor repita su contraseña"}
            </span>
          </div>
          <div className="mx-1 my-4">
            <button className="btn btn-primary m-auto" type="submit">
              <span className="material-icons">group_add</span>Crear cuenta
            </button>
          </div>
        </form>
      }
    />
  );
};

export default UserCreate;
