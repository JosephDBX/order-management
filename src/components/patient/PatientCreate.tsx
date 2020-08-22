import React, { useState } from "react";
import { IPatient } from "../../models/IPatient";
import { useForm } from "react-hook-form";
import CenterLayout from "../../layouts/CenterLayout";
import DateInput from "../custom/DateInput";

interface IPatientCreateProps {
  onCreatePatient(patient: IPatient): void;
}

type Inputs = {
  name: string;
  surname: string;
  birthDate: string;
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
  const [birthDate, setBirthDate] = useState(new Date());

  const { register, handleSubmit, errors } = useForm<Inputs>();

  const onSubmit = (data: Inputs) => {
    const patient: IPatient = {
      name: data.name,
      surname: data.surname,
      birthDate: data.birthDate,
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
              Nombres del paciente
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
              Apellidos del paciente
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
          <DateInput
            className="input input-primary"
            currentDate={birthDate}
            setCurrentDate={setBirthDate}
            showYearDropdown
            showMonthDropdown
            maxDate={new Date()}
            isWeekday
          />
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

export default PatientCreate;
