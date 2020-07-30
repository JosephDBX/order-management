import React from "react";
import { useHistory } from "react-router-dom";

interface IToolbarProps {
  isLogIn?: boolean;
  onCloseSession: Function;
}

const Toolbar: React.FunctionComponent<IToolbarProps> = ({
  isLogIn,
  onCloseSession,
}) => {
  const history = useHistory();
  const navigateToSignUp = () => {
    history.push("/sign-up");
  };

  return (
    <div className="fixed left-0 right-0 top-0 flex items-center bg-blue-600 text-white p-4 rounded-b shadow-lg">
      <div className="flex items-center">
        {isLogIn && (
          <button className="material-icons btn btn-primary shadow-none mr-2">
            <span className="material-icons">menu</span>
          </button>
        )}
        <button className="btn btn-primary shadow-none text-lg">LCBM</button>
      </div>
      <div className="flex-grow"></div>
      <div className="flex">
        {isLogIn ? (
          <>
            <button
              className="btn btn-primary shadow-none"
              onClick={() => onCloseSession()}
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
            <button className="btn btn-primary shadow-none">Acceder</button>
          </>
        )}
      </div>
      <div></div>
    </div>
  );
};

export default Toolbar;
