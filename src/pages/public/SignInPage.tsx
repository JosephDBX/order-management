import React, { BaseSyntheticEvent } from "react";
import CenterLayout from "../../layouts/CenterLayout";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useFirebase } from "react-redux-firebase";

type Inputs = {
  email: string;
  password: string;
};

const SignInPage: React.FunctionComponent = () => {
  const firebase = useFirebase();
  const history = useHistory();
  const { register, handleSubmit, watch, errors } = useForm<Inputs>();

  const onSubmit = (
    data: Inputs,
    event: BaseSyntheticEvent<object, any, any> | undefined
  ) => {
    let aux = false;
    toast.info("Procesando... por favor espere...");
    firebase
      .auth()
      .signInWithEmailAndPassword(data.email, data.password)
      .then((result) => {
        if (result.user?.emailVerified) {
          toast.success(
            "⬅️ Inicio de sesión exitoso ¡Presione el botón de menú (☰) para ver sus permisos!",
            {
              position: "top-left",
              autoClose: 10000,
            }
          );
          history.push("/");
        } else {
          aux = true;
          return result.user?.sendEmailVerification();
        }
      })
      .then(() => {
        if (aux) {
          return firebase.auth().signOut();
        }
      })
      .then(() => {
        if (aux) {
          toast.warning(
            "Se le ha enviado un correo electrónico de verificación, revise su bandeja de entrada y luego inicie sesión."
          );
        }
      })
      .catch((error) => {
        if (
          error.message ===
          "The password is invalid or the user does not have a password."
        ) {
          toast.error(
            "La contraseña no es válida o el usuario no tiene una contraseña."
          );
        } else {
          toast.error(error.message);
        }
      });
  };

  return (
    <CenterLayout
      title="Iniciar sesión"
      subTitle="¿Ya tienes una cuenta? Inicia sesión a continuación."
      component={
        <>
          <p className="mb-4">
            O{" "}
            <Link
              to="/sign-up"
              className="text-teal-500 underline hover:text-teal-300"
            >
              crea una nueva cuenta.
            </Link>
          </p>
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
                className="input input-secondary"
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
                className="input input-secondary"
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
            <div className="mx-1 my-4">
              <button className="btn btn-secondary m-auto" type="submit">
                <span className="material-icons">lock_open</span>Iniciar sesión
              </button>
            </div>
          </form>
          <p className="text-justify leading-8 pt-10 p-2">
            <b>¿Olvidaste tu contraseña?</b> Ingrese su correo electrónico
            arriba y presione{" "}
            <button className="btn inline-flex">
              <span className="material-icons">restore</span>Restablecer
              contraseña
            </button>{" "}
            para enviar un correo electrónico de restablecimiento de contraseña.
          </p>
        </>
      }
    />
  );
};

export default SignInPage;
