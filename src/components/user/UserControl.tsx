import React, { ChangeEvent } from "react";
import { ERol } from "../../models/ERol";
import { IRole } from "../../models/IUser";
import { useForm } from "react-hook-form";

interface IUserControlProps {
  rol: ERol;
  onFilter(ft: string, fr: IRole): void;
}

type Inputs = {
  filterText: string;
  isDeliveryWorker: boolean;
  isDoctor: boolean;
  isReceptionist: boolean;
  isLaboratorist: boolean;
  isAdmin: boolean;
};

const UserControl: React.FunctionComponent<IUserControlProps> = ({
  rol,
  onFilter,
}) => {
  const { register, watch } = useForm<Inputs>();

  const onSubmit = (event: ChangeEvent<HTMLInputElement>) => {
    onFilter(watch("filterText"), {
      isDeliveryWorker: watch("isDeliveryWorker"),
      isDoctor: watch("isDoctor"),
      isReceptionist: watch("isReceptionist"),
      isLaboratorist: watch("isLaboratorist"),
      isAdmin: watch("isAdmin"),
    });
  };

  return (
    <div className="m-2">
      <h3 className="m-1 text-center">Filtrar usuario</h3>
      <hr />
      <form className="flex flex-col justify-between sm:flex-row">
        <div className="input-group mt-8">
          <input
            className="input input-secondary"
            type="text"
            name="filterText"
            placeholder="Email"
            onChange={onSubmit}
            ref={register}
          />
          <span className="input-hint">
            Código o email
            </span>
        </div>
        <div className="p-2">
          <h3 className="text-right">Filtrar por Acceso de Usuario</h3>
          <hr className="ml-2 my-2" />
          <div className="input-group flex-row items-center justify-center">
            <input
              className="w-8"
              type="checkbox"
              name="isDeliveryWorker"
              id="isDeliveryWorker"
              ref={register}
              onChange={onSubmit}
            />
            <label
              className="btn cursor-pointer flex-grow"
              htmlFor="isDeliveryWorker"
            >
              Panel de Delivery
            </label>
          </div>
          <div className="input-group flex-row items-center justify-center">
            <input
              className="w-8"
              type="checkbox"
              name="isDoctor"
              id="isDoctor"
              ref={register}
              onChange={onSubmit}
            />
            <label
              className="btn cursor-pointer flex-grow"
              htmlFor="isDoctor"
            >
              Permisos de Médico
            </label>
          </div>
          <div className="input-group flex-row items-center justify-center">
            <input
              className="w-8"
              type="checkbox"
              name="isReceptionist"
              id="isReceptionist"
              ref={register}
              onChange={onSubmit}
            />
            <label
              className="btn cursor-pointer flex-grow"
              htmlFor="isReceptionist"
            >
              Panel de Recepcionista
            </label>
          </div>
          <div className="input-group flex-row items-center justify-center">
            <input
              className="w-8"
              type="checkbox"
              name="isLaboratorist"
              id="isLaboratorist"
              ref={register}
              onChange={onSubmit}
            />
            <label
              className="btn cursor-pointer flex-grow"
              htmlFor="isLaboratorist"
            >
              Panel de Laboratorista
            </label>
          </div>
          <div className="input-group flex-row items-center justify-center">
            <input
              className="w-8"
              type="checkbox"
              name="isAdmin"
              id="isAdmin"
              ref={register}
              onChange={onSubmit}
            />
            <label
              className="btn cursor-pointer flex-grow"
              htmlFor="isAdmin"
            >
              Panel de Administrador
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserControl;
