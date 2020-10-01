import React from "react";
import { useHistory } from "react-router-dom";

const ReceptionistPanel: React.FunctionComponent = () => {
  const history = useHistory();
  const navigateToUserManagement = () => {
    history.push("/receptionist-panel/users");
  };
  const navigateToPatientManagement = () => {
    history.push("/receptionist-panel/patients");
  };
  return (
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
    </div>
  );
};

export default ReceptionistPanel;
