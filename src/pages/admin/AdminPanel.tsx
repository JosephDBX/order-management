import React from "react";
import { useHistory } from "react-router-dom";

const AdminPanel: React.FunctionComponent = () => {
  const history = useHistory();
  const navigateToUserManagement = () => {
    history.push("/admin-panel/users");
  };
  const navigateToAreaManagement = () => {
    history.push("/admin-panel/areas");
  };
  const navigateToProfileManagement = () => {
    history.push("/admin-panel/profiles");
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
        onClick={navigateToAreaManagement}
      >
        <span className="material-icons">folder</span>Gestionar Areas
      </button>
      <button
        className="btn btn-warning w-56 h-56 m-4"
        onClick={navigateToProfileManagement}
      >
        <span className="material-icons">bookmark</span>Gestionar Perfiles
      </button>
    </div>
  );
};

export default AdminPanel;
