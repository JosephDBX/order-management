import React, { useState } from "react";
import { IPatient } from "../../models/IPatient";
import { useForm } from "react-hook-form";
import CenterLayout from "../../layouts/CenterLayout";
import moment from "moment";
import DateInput from "../custom/DateInput";

interface IPatientCreateProps {
  onCreatePatient(patient: IPatient): void;
}

type Inputs = {
  name: string;
  surname: string;
  ind: string;
  sex: boolean;
  // contact
  phoneNumber: string;
  address: string;
  email: string;
};

const PatientCreate: React.FunctionComponent<IPatientCreateProps> = ({
  onCreatePatient,
}) => {
  const [birthDate, setBirthDate] = useState(
    moment().set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }).toDate()
  );

  const { register, handleSubmit, errors } = useForm<Inputs>();

  const onSubmit = (data: Inputs) => {
    const patient: IPatient = {
      name: data.name,
      surname: data.surname,
      birthDate: birthDate.toISOString(),
      ind: data.ind,
      sex: data.sex,
      contact: {
        phoneNumber: data.phoneNumber,
        address: data.address,
        email: data.email,
      },
    };
    onCreatePatient(patient);
  };

  return (
    <CenterLayout
      title="Crear un nuevo paciente"
      component={
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className={`input-group ${!!errors.name && "input-group-danger"}`}
          >
            <label htmlFor="name" className="input-label">
              Nombres
            </label>
            <input
              className="input input-primary"
              type="text"
              name="name"
              placeholder="Nombres del paciente"
              ref={register({
                required: {
                  value: true,
                  message: "Los nombres del paciente son requeridos",
                },
              })}
            />
            <span className="input-hint">
              {!!errors.name
                ? errors.name.message
                : "Por favor ingrese los nombres del nuevo paciente"}
            </span>
          </div>
          <div
            className={`input-group ${
              !!errors.surname && "input-group-danger"
            }`}
          >
            <label htmlFor="surname" className="input-label">
              Apellidos
            </label>
            <input
              className="input input-primary"
              type="text"
              name="surname"
              placeholder="Apellidos del paciente"
              ref={register({
                required: {
                  value: true,
                  message: "Los apellidos del paciente son requeridos",
                },
              })}
            />
            <span className="input-hint">
              {!!errors.surname
                ? errors.surname.message
                : "Por favor ingrese los apellidos del nuevo paciente"}
            </span>
          </div>
          <div className="input-group">
            <label htmlFor="birthDate" className="input-label">
              Fecha de nacimiento
            </label>
            <DateInput
              className="input input-primary w-full text-teal-500"
              currentDate={birthDate}
              setCurrentDate={setBirthDate}
              showYearDropdown
              showMonthDropdown
              maxDate={new Date()}
              name="birthDate"
              placeholder="Fecha de nacimiento del paciente"
            />
            <span className="input-hint">
              Por favor ingrese la fecha de nacimiento del nuevo paciente
            </span>
          </div>
          <div
            className={`input-group ${!!errors.ind && "input-group-danger"}`}
          >
            <label htmlFor="ind" className="input-label">
              Número de cédula
            </label>
            <input
              className="input input-primary"
              type="text"
              name="ind"
              placeholder="Número de cédula del paciente"
              ref={register({
                pattern: {
                  value: /[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][A-Z]/,
                  message:
                    "Por favor ingrese un formato de número de cédula válido: 0003112990000A",
                },
                maxLength: {
                  value: 14,
                  message:
                    "El número de cédula no puede tener más de 14 dígitos",
                },
              })}
            />
            <span className="input-hint">
              {!!errors.ind ? errors.ind.message : "0003112990000A"}
            </span>
          </div>
          <div
            className={`input-group ${!!errors.sex && "input-group-danger"}`}
          >
            <label htmlFor="sex" className="input-label">
              Sexo
            </label>
            <select
              className="input input-primary"
              name="sex"
              ref={register({
                required: {
                  value: true,
                  message: "El sexo del paciente es requerido",
                },
              })}
            >
              <option className="text-gray-700 font-semibold" value="Male">
                Masculino
              </option>
              <option className="text-gray-700 font-semibold" value="Female">
                Femenino
              </option>
            </select>
            <span className="input-hint">
              {!!errors.sex
                ? errors.sex.message
                : "Por favor, especifique el sexo biológico del nuevo paciente"}
            </span>
          </div>
          <div
            className={`input-group ${
              !!errors.phoneNumber && "input-group-danger"
            }`}
          >
            <label htmlFor="phoneNumber" className="input-label">
              Número de teléfono
            </label>
            <input
              className="input input-primary"
              type="text"
              name="phoneNumber"
              placeholder="Número de teléfono del paciente"
              ref={register({
                required: {
                  value: true,
                  message: "El número de teléfono del paciente es requerido",
                },
                pattern: {
                  value: /[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]/,
                  message:
                    "Por favor ingrese un formato de número de teléfono válido: 88886666",
                },
                maxLength: {
                  value: 8,
                  message:
                    "El número de teléfono no puede tener más de 8 dígitos",
                },
              })}
            />
            <span className="input-hint">
              {!!errors.phoneNumber ? errors.phoneNumber.message : "88886666"}
            </span>
          </div>
          <div
            className={`input-group ${
              !!errors.address && "input-group-danger"
            }`}
          >
            <label htmlFor="address" className="input-label">
              Dirección
            </label>
            <input
              className="input input-primary"
              type="text"
              name="address"
              placeholder="Dirección del paciente"
              ref={register({
                required: {
                  value: true,
                  message: "La dirección del paciente es requerida",
                },
              })}
            />
            <span className="input-hint">
              {!!errors.address
                ? errors.address.message
                : "Por favor ingrese la dirección del nuevo paciente"}
            </span>
          </div>
          <div
            className={`input-group ${!!errors.email && "input-group-danger"}`}
          >
            <label htmlFor="email" className="input-label">
              Correo electrónico
            </label>
            <input
              className="input input-primary"
              type="email"
              name="email"
              placeholder="Correo electrónico del paciente"
              ref={register({
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
                : "Por favor ingrese el correo electrónico del nuevo paciente"}
            </span>
          </div>
          <div className="mx-1 my-4">
            <button className="btn btn-primary m-auto" type="submit">
              <span className="material-icons">add_circle</span>Crear Paciente
            </button>
          </div>
        </form>
      }
    />
  );
};

export default PatientCreate;
