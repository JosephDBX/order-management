import React from "react";
import { useSelector } from "react-redux";
import { IUser } from "../../models/IUser";
import { useHistory } from "react-router-dom";

interface ISidenavProps {
  onCloseModal(): void;
}

const Sidenav: React.FunctionComponent<ISidenavProps> = ({ onCloseModal }) => {
  const currentUser: IUser = useSelector(
    (state: any) => state.firebase.profile
  );

  const history = useHistory();
  const navigateToUserPanel = () => {
    history.push("/user-panel");
    onCloseModal();
  };
  const navigateToDeliveryWorkerPanel = () => {
    history.push("/delivery-worker-panel");
    onCloseModal();
  };
  const navigateToReceptionistPanel = () => {
    history.push("/receptionist-panel");
    onCloseModal();
  };
  const navigateToLaboratoristPanel = () => {
    history.push("/laboratorist-panel");
    onCloseModal();
  };
  const navigateToAdminPanel = () => {
    history.push("/admin-panel");
    onCloseModal();
  };

  return (
    <>
      <div className="py-6 bg-blue-600">
        <h2 className="text-center text-white text-2xl">LCBM</h2>
      </div>
      <div className="bg-gray-100 h-full">
        <h3 className="text-lg pt-4 text-center">Permisos de usuario</h3>
        <hr className="mx-2" />
        <div className="mt-4">
          <button className="btn w-full p-2 my-2" onClick={navigateToUserPanel}>
            Panel de Usuario
          </button>
        </div>
        {currentUser.roles?.isDeliveryWorker ? (
          <button
            className="btn w-full p-2 my-2"
            onClick={navigateToDeliveryWorkerPanel}
          >
            Panel de Delivery
          </button>
        ) : null}
        {currentUser.roles?.isReceptionist ? (
          <button
            className="btn w-full p-2 my-2"
            onClick={navigateToReceptionistPanel}
          >
            Panel de Recepcionista
          </button>
        ) : null}
        {currentUser.roles?.isLaboratorist ? (
          <button
            className="btn w-full p-2 my-2"
            onClick={navigateToLaboratoristPanel}
          >
            Panel de Laboratorista
          </button>
        ) : null}
        {currentUser.roles?.isAdmin ? (
          <button
            className="btn w-full p-2 my-2"
            onClick={navigateToAdminPanel}
          >
            Panel de Administrador
          </button>
        ) : null}
      </div>
    </>
  );
};

export default Sidenav;
