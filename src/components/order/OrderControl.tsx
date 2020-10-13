import React, { useEffect, useState } from "react";
import { ERol } from "../../models/ERol";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { IPatient } from "../../models/IPatient";
import SelectListLayout from "../../layouts/SelectListLayout";
import SelectItemLayout from "../../layouts/SelectItemLayout";
import { IUser } from "../../models/IUser";
import ModalLayout from "../../layouts/ModalLayout";
import UserControl from "../user/UserControl";
import moment from "moment";
import DateInput from "../custom/DateInput";
import PatientControl from "../patient/PatientControl";

interface IOrderControlProps {
  patient: IPatient;
  patients: IPatient[];
  rol: ERol;
  defaultText?: string;
  doctors: IUser[];
  onFilterText(
    filterText: string,
    state: string,
    doctorId: string,
    selectedPatients: IPatient[],
    startAt?: Date,
    endAt?: Date
  ): void;
  onPrintFilterResult(): void;
}

type Inputs = {
  filterText: string;
  state: string;
};

const OrderControl: React.FunctionComponent<IOrderControlProps> = ({
  patient,
  patients,
  rol,
  defaultText,
  doctors,
  onFilterText,
  onPrintFilterResult,
}) => {
  const { register, watch } = useForm<Inputs>();

  const history = useHistory();
  const navigateToCreate = () => {
    switch (rol) {
      case ERol.Public: {
        history.push(`/user-panel/patients/${patient.id}/orders/create`);
        break;
      }
      case ERol.Receptionist: {
        history.push(
          `/receptionist-panel/patients/${patient.id}/orders/create`
        );
        break;
      }
    }
  };

  const printFilterResult = () => {
    onPrintFilterResult();
  };

  const onSubmit = () => {
    onFilterText(
      watch("filterText"),
      watch("state"),
      selectedDoctor && selectedDoctor.id ? selectedDoctor.id : "",
      selectedPatients,
      isDateTimeFilter ? startAt : undefined,
      isDateTimeFilter ? endAt : undefined
    );
  };

  // Doctor
  const [modalDoctor, setModalDoctor] = useState(false);
  const onOpenModalDoctor = () => {
    setModalDoctor(true);
    onFilterTextDoctor(filterTextDoctor);
  };
  const onCloseModalDoctor = () => {
    setModalDoctor(false);
    setFilterTextDoctor("");
  };

  const [selectedDoctor, setSelectedDoctor] = useState<IUser>();
  const [listDoctor, setListDoctor] = useState<IUser[]>(doctors);
  const [filterTextDoctor, setFilterTextDoctor] = useState("");

  const onFilterTextDoctor = (filter: string) => {
    let aux = doctors.filter(
      (doctor) =>
        doctor.uid?.includes(filter) ||
        doctor.email?.toLowerCase().includes(filter.toLocaleLowerCase())
    );
    if (selectedDoctor) {
      aux = aux.filter((d) => d.id !== selectedDoctor.id);
    }
    setListDoctor(aux);
    setFilterTextDoctor(filter);
  };

  const onAddDoctor = (doctor: IUser) => {
    setSelectedDoctor(doctor);
    if (selectedDoctor) {
      setListDoctor(listDoctor.filter((d) => d.id !== selectedDoctor.id));
    }
    onCloseModalDoctor();
  };
  const onRemoveDoctor = (doctor: IUser) => {
    setListDoctor([...listDoctor, doctor]);
    setSelectedDoctor(undefined);
  };

  // Patients
  const [selectedPatients, setSelectedPatients] = useState<IPatient[]>([]);
  const [listPatient, setListPatient] = useState<IPatient[]>(
    patients ? patients : []
  );
  const [filterTextPatient, setFilterTextPatient] = useState("");

  const onFilterTextPatient = (filter: string) => {
    let aux = patients
      ?.filter(
        (patient) =>
          patient.id?.includes(filter) ||
          `${patient.name} ${patient.surname}`
            .toLowerCase()
            .includes(filter.toLowerCase()) ||
          patient.ind?.toLowerCase().includes(filter.toLowerCase()) ||
          patient.contact.phoneNumber
            .toLowerCase()
            .includes(filter.toLowerCase()) ||
          patient.contact.address
            ?.toLowerCase()
            .includes(filter.toLowerCase()) ||
          patient.contact.email?.toLowerCase().includes(filter.toLowerCase())
      )
      .sort((first, second) =>
        first.name > second.name ? 1 : first.surname > second.surname ? 1 : -1
      );
    selectedPatients.forEach((s) => {
      aux = aux?.filter((l) => l.id !== s.id);
    });
    setListPatient(aux ? aux : []);
    setFilterTextPatient(filter);
  };

  const onAddPatient = (p: IPatient) => {
    setSelectedPatients([...selectedPatients, p]);
    setListPatient(listPatient.filter((l) => l.id !== p.id));
    onCloseModalPatient();
  };
  const onRemovePatient = (p: IPatient) => {
    setListPatient([...listPatient, p]);
    setSelectedPatients(selectedPatients.filter((s) => s.id !== p.id));
  };

  const [modalPatient, setModalPatient] = useState(false);
  const onOpenModalPatient = () => {
    setModalPatient(true);
    onFilterTextPatient(filterTextPatient);
  };
  const onCloseModalPatient = () => {
    setModalPatient(false);
    setFilterTextPatient("");
  };

  // Date

  const [isDateTimeFilter, setIsDateTimeFilter] = useState(false);
  const toggleIsDateTimeFilter = () => {
    setIsDateTimeFilter(!isDateTimeFilter);
  };

  const [startAt, setStart] = useState(
    moment().set({ hours: 5, minutes: 0, seconds: 0, milliseconds: 0 }).toDate()
  );
  const setStartAt = (date: Date) => {
    setStart(date);
  };
  const [endAt, setEnd] = useState(
    moment().set({ hours: 9, minutes: 0, seconds: 0, milliseconds: 0 }).toDate()
  );
  const setEndAt = (date: Date) => {
    setEnd(date);
  };

  useEffect(() => {
    onSubmit();
  }, [selectedDoctor, selectedPatients, isDateTimeFilter, startAt, endAt]);

  return (
    <>
      <div className="m-2">
        <h3 className="m-1 text-center">Filtrar orden</h3>
        <hr />
        <div className="flex flex-col items-center flex-wrap">
          <form className="flex flex-grow flex-col justify-around w-full flex-wrap sm:flex-row">
            <div className="input-group mt-8">
              <input
                className="input input-secondary"
                type="text"
                name="filterText"
                placeholder="Código de la orden"
                defaultValue={defaultText}
                onChange={onSubmit}
                ref={register}
              />
              <span className="input-hint">Código de la orden</span>
            </div>
            {rol !== ERol.Laboratorist && rol !== ERol.DeliveryWorker ? (
              <div className="p-2 mx-auto mt-5">
                <h3 className="text-right">Estado de la orden</h3>
                <hr className="ml-2 my-2" />
                <div className="input-group flex-row items-center justify-center">
                  <select
                    className="input input-secondary"
                    name="state"
                    ref={register}
                    onChange={onSubmit}
                  >
                    <option className="text-gray-700 font-semibold" value="">
                      Seleccionar...
                    </option>
                    <option
                      className="text-gray-700 font-semibold"
                      value="pending"
                    >
                      Pendiente
                    </option>
                    <option
                      className="text-gray-700 font-semibold"
                      value="process"
                    >
                      En Proceso
                    </option>
                    <option
                      className="text-gray-700 font-semibold"
                      value="complete"
                    >
                      Completa
                    </option>
                  </select>
                </div>
              </div>
            ) : null}
            <div className="my-4">
              <SelectListLayout
                title="Médico ordenando el examen"
                onAdd={onOpenModalDoctor}
                selected={
                  selectedDoctor &&
                  [selectedDoctor].map((d) => (
                    <SelectItemLayout
                      title={d?.userName as string}
                      subTitle={d?.email as string}
                      onAdd={() => onAddDoctor(d as IUser)}
                      onRemove={() => onRemoveDoctor(d as IUser)}
                      removable
                      key={d?.id}
                    />
                  ))
                }
              />
            </div>
            {rol === ERol.DeliveryWorker || rol === ERol.Laboratorist ? (
              <div className="my-4">
                <SelectListLayout
                  title="Pacientes"
                  onAdd={onOpenModalPatient}
                  selected={selectedPatients.map((p) => (
                    <SelectItemLayout
                      title={`${p.name} ${p.surname}`}
                      subTitle={`Código: ${p.id}`}
                      onAdd={() => onAddPatient(p)}
                      onRemove={() => onRemovePatient(p)}
                      removable
                      key={p.id}
                    />
                  ))}
                />
              </div>
            ) : null}
          </form>
          <div className="flex flex-col justify-evenly w-full flex-wrap md:flex-row">
            <div>
              <div
                className={`btn ${
                  isDateTimeFilter ? "btn-secondary" : ""
                } cursor-pointer`}
              >
                <input
                  type="checkbox"
                  name="isDateTimeFilter"
                  id="isDateTimeFilter"
                  checked={isDateTimeFilter}
                  onChange={toggleIsDateTimeFilter}
                />
                <label htmlFor="isDateTimeFilter" className="cursor-pointer">
                  ¿Fecha y hora?
                </label>
              </div>
            </div>
            {isDateTimeFilter ? (
              <>
                <div className="input-group flex-grow m-2">
                  <label htmlFor="startAt" className="input-label">
                    Fecha de inicio
                  </label>
                  <DateInput
                    className="input input-primary w-full text-teal-500"
                    currentDate={startAt}
                    setCurrentDate={setStartAt}
                    name="startAt"
                    placeholder="Fecha de inicio"
                    maxDate={endAt}
                    showTime
                    includeTimes={[
                      moment().set({ hours: 5, minutes: 0 }).toDate(),
                      moment().set({ hours: 5, minutes: 30 }).toDate(),
                      moment().set({ hours: 6, minutes: 0 }).toDate(),
                      moment().set({ hours: 6, minutes: 30 }).toDate(),
                      moment().set({ hours: 7, minutes: 0 }).toDate(),
                      moment().set({ hours: 7, minutes: 30 }).toDate(),
                      moment().set({ hours: 8, minutes: 0 }).toDate(),
                      moment().set({ hours: 8, minutes: 30 }).toDate(),
                      moment().set({ hours: 9, minutes: 0 }).toDate(),
                    ]}
                  />
                </div>
                <div className="input-group flex-grow m-2">
                  <label htmlFor="endAt" className="input-label">
                    Fecha de fin
                  </label>
                  <DateInput
                    className="input input-primary w-full text-teal-500"
                    currentDate={endAt}
                    setCurrentDate={setEndAt}
                    name="endAt"
                    placeholder="Fecha de fin"
                    minDate={startAt}
                    showTime
                    includeTimes={[
                      moment().set({ hours: 5, minutes: 0 }).toDate(),
                      moment().set({ hours: 5, minutes: 30 }).toDate(),
                      moment().set({ hours: 6, minutes: 0 }).toDate(),
                      moment().set({ hours: 6, minutes: 30 }).toDate(),
                      moment().set({ hours: 7, minutes: 0 }).toDate(),
                      moment().set({ hours: 7, minutes: 30 }).toDate(),
                      moment().set({ hours: 8, minutes: 0 }).toDate(),
                      moment().set({ hours: 8, minutes: 30 }).toDate(),
                      moment().set({ hours: 9, minutes: 0 }).toDate(),
                    ]}
                  />
                </div>
              </>
            ) : null}
          </div>
          <hr className="w-full my-2" />

          <div className="flex flex-row justify-center p-2">
            <button
              className="btn btn-secondary m-2"
              onClick={printFilterResult}
            >
              <span className="material-icons">local_printshop</span>
              Imprimir Resultado
            </button>{" "}
            {rol !== ERol.Laboratorist && rol !== ERol.DeliveryWorker ? (
              <button
                className="btn btn-primary m-2"
                onClick={navigateToCreate}
              >
                <span className="material-icons">add_circle</span>Crear Órden
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <ModalLayout
        title="Médico ordenando el examen"
        open={modalDoctor}
        component={
          <>
            <UserControl rol={ERol.Public} onFilter={onFilterTextDoctor} />
            <div className="frame" style={{ maxHeight: "16rem" }}>
              {listDoctor.map((d) => (
                <SelectItemLayout
                  title={d?.userName as string}
                  subTitle={d?.email as string}
                  onAdd={() => onAddDoctor(d as IUser)}
                  onRemove={() => onRemoveDoctor(d as IUser)}
                  key={d?.id}
                />
              ))}
            </div>
          </>
        }
        onClose={onCloseModalDoctor}
      />
      <ModalLayout
        title="Pacientes"
        open={modalPatient}
        component={
          <>
            <PatientControl
              rol={rol}
              onFilterText={onFilterTextPatient}
              disableCreate
              noCreate
            />
            <div className="frame" style={{ maxHeight: "16rem" }}>
              {listPatient.map((p) => (
                <SelectItemLayout
                  title={`${p.name} ${p.surname}`}
                  subTitle={`Código: ${p.id}`}
                  onAdd={() => onAddPatient(p)}
                  onRemove={() => onRemovePatient(p)}
                  key={p.id}
                />
              ))}
            </div>
          </>
        }
        onClose={onCloseModalPatient}
      />
    </>
  );
};

export default OrderControl;
