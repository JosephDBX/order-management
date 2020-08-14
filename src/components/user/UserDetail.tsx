import React, { ChangeEvent } from "react";
import { IUser, IRole } from "../../models/IUser";
import { ERol } from "../../models/ERol";
import SummaryLayout from "../../layouts/SummaryLayout";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

interface IUserDetailProps {
  user: IUser;
  rol: ERol;
  isMain?: boolean;
  onUserStateChange?(id: string, roles: IRole): void;
  onRestorePassword(email: string): void;
}

type Inputs = {
  isDeliveryWorker: boolean;
  isDoctor: boolean;
  isReceptionist: boolean;
  isLaboratorist: boolean;
  isAdmin: boolean;
};

const UserDetail: React.FunctionComponent<IUserDetailProps> = ({
  user,
  rol,
  isMain,
  onUserStateChange,
  onRestorePassword,
}) => {
  const history = useHistory();
  const navigateToUserPanel = () => {
    history.push("/user-panel");
  };
  const navigateToDeliveryWorkerPanel = () => {
    history.push("/delivery-panel");
  };
  const navigateToReceptionistPanel = () => {
    history.push("/receptionist-panel");
  };
  const navigateToLaboratoristPanel = () => {
    history.push("/laboratorist-panel");
  };
  const navigateToAdminPanel = () => {
    history.push("/admin-panel");
  };

  const { register, watch } = useForm<Inputs>();

  const onSubmit = (event: ChangeEvent<HTMLInputElement>) => {
    if (onUserStateChange) onUserStateChange(user.uid as string, watch());
  };

  const onRestore = () => {
    onRestorePassword(user.email);
  };

  return (
    <SummaryLayout
      title={isMain ? "Tu usuario" : "Usuario"}
      styleTitle={
        rol === ERol.Admin && isMain
          ? "bg-blue-600 text-white"
          : "bg-teal-600 text-white"
      }
      component={
        <>
          <div
            className={
              rol === ERol.Admin && isMain ? "bg-blue-600" : "bg-teal-600"
            }
          >
            <h4 className="text-center p-2 text-white frame">{user.email}</h4>
          </div>
          <div className="mt-4">
            <h4 className="text-center">Accesos de usuario</h4>
            <hr />
            <div className="flex flex-col">
              {rol === ERol.Admin ? (
                <form>
                  <div className="input-group flex-row items-center justify-center">
                    <input
                      className="w-8"
                      type="checkbox"
                      name="isDeliveryWorker"
                      id={`isDeliveryWorker${user.uid}`}
                      defaultChecked={user.roles?.isDeliveryWorker}
                      ref={register}
                      onChange={onSubmit}
                    />
                    <label
                      className={`btn ${
                        user.roles?.isDeliveryWorker ? "btn-secondary" : ""
                      } cursor-pointer flex-grow`}
                      htmlFor={`isDeliveryWorker${user.uid}`}
                    >
                      Panel de Delivery
                    </label>
                  </div>
                  <div className="input-group flex-row items-center justify-center">
                    <input
                      className="w-8"
                      type="checkbox"
                      name="isDoctor"
                      id={`isDoctor${user.uid}`}
                      defaultChecked={user.roles?.isDoctor}
                      ref={register}
                      onChange={onSubmit}
                    />
                    <label
                      className={`btn ${
                        user.roles?.isDoctor ? "btn-secondary" : ""
                      } cursor-pointer flex-grow`}
                      htmlFor={`isDoctor${user.uid}`}
                    >
                      Permisos de Médico
                    </label>
                  </div>
                  <div className="input-group flex-row items-center justify-center">
                    <input
                      className="w-8"
                      type="checkbox"
                      name="isReceptionist"
                      id={`isReceptionist${user.uid}`}
                      defaultChecked={user.roles?.isReceptionist}
                      ref={register}
                      onChange={onSubmit}
                    />
                    <label
                      className={`btn ${
                        user.roles?.isReceptionist ? "btn-secondary" : ""
                      } cursor-pointer flex-grow`}
                      htmlFor={`isReceptionist${user.uid}`}
                    >
                      Panel de Recepcionista
                    </label>
                  </div>
                  <div className="input-group flex-row items-center justify-center">
                    <input
                      className="w-8"
                      type="checkbox"
                      name="isLaboratorist"
                      id={`isLaboratorist${user.uid}`}
                      defaultChecked={user.roles?.isLaboratorist}
                      ref={register}
                      onChange={onSubmit}
                    />
                    <label
                      className={`btn ${
                        user.roles?.isLaboratorist ? "btn-secondary" : ""
                      } cursor-pointer flex-grow`}
                      htmlFor={`isLaboratorist${user.uid}`}
                    >
                      Panel de Laboratorista
                    </label>
                  </div>
                  {isMain ? (
                    <p className="pl-6 text-gray-600 font-semibold text-center">
                      ¡No puede cambiar su propio acceso de administrador!
                    </p>
                  ) : (
                    <div className="input-group flex-row items-center justify-center">
                      <input
                        className="w-8"
                        type="checkbox"
                        name="isAdmin"
                        id={`isAdmin${user.uid}`}
                        defaultChecked={user.roles?.isAdmin}
                        ref={register}
                        onChange={onSubmit}
                      />
                      <label
                        className={`btn ${
                          user.roles?.isAdmin ? "btn-secondary" : ""
                        } cursor-pointer flex-grow`}
                        htmlFor={`isAdmin${user.uid}`}
                      >
                        Panel de Administrador
                      </label>
                    </div>
                  )}
                </form>
              ) : (
                <>
                  <button
                    className="btn w-full p-2 my-2"
                    onClick={navigateToUserPanel}
                  >
                    Panel de Usuario
                  </button>
                  {user.roles?.isDeliveryWorker ? (
                    <button
                      className="btn w-full p-2 my-2"
                      onClick={navigateToDeliveryWorkerPanel}
                    >
                      Panel de Delivery
                    </button>
                  ) : null}
                  {user.roles?.isReceptionist ? (
                    <button
                      className="btn w-full p-2 my-2"
                      onClick={navigateToReceptionistPanel}
                    >
                      Panel de Recepcionista
                    </button>
                  ) : null}
                  {user.roles?.isLaboratorist ? (
                    <button
                      className="btn w-full p-2 my-2"
                      onClick={navigateToLaboratoristPanel}
                    >
                      Panel de Laboratorista
                    </button>
                  ) : null}
                  {user.roles?.isAdmin ? (
                    <button
                      className="btn w-full p-2 my-2"
                      onClick={navigateToAdminPanel}
                    >
                      Panel de Administrador
                    </button>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </>
      }
      code={user.id}
      controls={
        <button className="btn btn-warning" onClick={onRestore}>
          Restablecer contraseña
        </button>
      }
    />
  );
};

export default UserDetail;
