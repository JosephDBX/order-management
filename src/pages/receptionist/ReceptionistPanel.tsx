import React from "react";
import { useHistory } from "react-router-dom";
import Breadcrumbs from "../../components/custom/Breadcrumbs";

const ReceptionistPanel: React.FunctionComponent = () => {
  const history = useHistory();
  const navigateToUserManagement = () => {
    history.push("/receptionist-panel/users");
  };
  const navigateToPatientManagement = () => {
    history.push("/receptionist-panel/patients");
  };
  const navigateToOrderManagement = () => {
    history.push("/receptionist-panel/orders");
  };
  return (
    <>
      <Breadcrumbs
        navigations={[{ uri: "/home", text: "Home" }]}
        last="Panel de recepcionista"
      />
      <div className="flex flex-col justify-center items-center md:flex-row">
        <button
          className="btn btn-primary w-56 h-56 m-4"
          onClick={navigateToUserManagement}
        >
          <span className="material-icons">group</span>Gestionar Usuarios
        </button>
        <button
          className="btn btn-secondary w-56 h-56 m-4"
          onClick={navigateToPatientManagement}
        >
          <span className="material-icons">accessible</span>Gestionar Pacientes
        </button>
        <button
          className="btn btn-warning w-56 h-56 m-4"
          onClick={navigateToOrderManagement}
        >
          <span className="material-icons">assignment</span>Gestionar Ordenes
        </button>
      </div>
    </>
  );
};

export default ReceptionistPanel;
