import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ModalLayout from "../../layouts/ModalLayout";
import Sidenav from "./Sidenav";

interface IToolbarProps {
  isLogIn?: boolean;
  onCloseSession(): void;
}

const Toolbar: React.FunctionComponent<IToolbarProps> = ({
  isLogIn,
  onCloseSession,
}) => {
  const history = useHistory();
  const navigateToSignUp = () => {
    history.push("/sign-up");
  };
  const navigateToSignIn = () => {
    history.push("/sign-in");
  };
  const navigateToHome = () => {
    history.push("/");
  };
  const [modal, setModal] = useState(false);
  const onOpenModal = () => {
    setModal(true);
  };
  const onCloseModal = () => {
    setModal(false);
  };

  return (
    <div className="fixed left-0 right-0 top-0 flex items-center bg-blue-600 text-white p-4 rounded-b shadow-lg">
      <div className="flex items-center">
        {isLogIn && (
          <button
            className="material-icons btn btn-primary shadow-none mr-2"
            onClick={onOpenModal}
          >
            <span className="material-icons">menu</span>
          </button>
        )}
        <button
          className="btn btn-primary shadow-none text-lg"
          onClick={navigateToHome}
        >
          LCBM
        </button>
      </div>
      <div className="flex-grow"></div>
      <div className="flex">
        {isLogIn ? (
          <>
            <button
              className="btn btn-primary shadow-none"
              onClick={onCloseSession}
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-primary shadow-none mr-2 md:mr-4"
              onClick={navigateToSignUp}
            >
              Registrarse
            </button>
            <button
              className="btn btn-primary shadow-none"
              onClick={navigateToSignIn}
            >
              Acceder
            </button>
          </>
        )}
      </div>
      <ModalLayout
        open={modal}
        component={<Sidenav onCloseModal={onCloseModal} />}
        type={1}
        onClose={onCloseModal}
      />
    </div>
  );
};

export default Toolbar;
