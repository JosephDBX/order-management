import React from "react";
import { IUser, IRole } from "../../models/IUser";
import { ERol } from "../../models/ERol";
import SummaryLayout from "../../layouts/SummaryLayout";

interface IUserDetailProps {
  user: IUser;
  rol: ERol;
  isMain?: boolean;
  onUserStateChange?(id: string, roles: IRole): void;
}

const UserDetail: React.FunctionComponent<IUserDetailProps> = ({
  user,
  rol,
  isMain,
  onUserStateChange,
}) => {
  return (
    <SummaryLayout
      title={isMain ? "Tu usuario" : "Usuario"}
      styleTitle={
        rol === ERol.Admin && isMain
          ? "bg-blue-600 text-white"
          : "bg-teal-600 text-white"
      }
      component={<></>}
      code={user.id}
      controls={
        <button className="btn btn-warning">Restablecer contraseña</button>
      }
    />
  );
};

export default UserDetail;
