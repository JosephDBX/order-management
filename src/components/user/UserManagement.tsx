import React, { useState, useEffect } from "react";
import { ERol } from "../../models/ERol";
import { IUser, IRole } from "../../models/IUser";
import UserDetail from "./UserDetail";
import ManageLayout from "../../layouts/ManageLayout";
import UserControl from "./UserControl";
import GridLayout from "../../layouts/GridLayout";

interface IUserManagementProps {
  rol: ERol.Admin;
  users: IUser[];
  onUserStateChange?(id: string, roles: IRole): void;
  onRestorePassword(email: string): void;
}

const UserManagement: React.FunctionComponent<IUserManagementProps> = ({
  rol,
  users,
  onUserStateChange,
  onRestorePassword,
}) => {
  const [list, setList] = useState<any[]>(
    users.map((user) => (
      <UserDetail
        user={user}
        rol={rol}
        onUserStateChange={onUserStateChange}
        onRestorePassword={onRestorePassword}
        key={user.id}
      />
    ))
  );
  const [filterText, setFilterText] = useState("");
  const [filterRol, setFilterRol] = useState<IRole>({
    isDeliveryWorker: false,
    isDoctor: false,
    isReceptionist: false,
    isLaboratorist: false,
    isAdmin: false,
  });

  const onFilter = (ft: string, fr: IRole) => {
    setList(
      users
        .filter(
          (user) =>
            user.id?.includes(ft) ||
            user.email.toLowerCase().includes(ft.toLowerCase()) ||
            (fr.isDeliveryWorker && user.roles?.isDeliveryWorker) ||
            (fr.isDoctor && user.roles?.isDoctor) ||
            (fr.isReceptionist && user.roles?.isReceptionist) ||
            (fr.isLaboratorist && user.roles?.isLaboratorist) ||
            (fr.isAdmin && user.roles?.isAdmin)
        )
        .map((user) => (
          <UserDetail
            user={user}
            rol={rol}
            onUserStateChange={onUserStateChange}
            onRestorePassword={onRestorePassword}
            key={user.id}
          />
        ))
    );
    setFilterText(ft);
    setFilterRol(fr);
  };

  useEffect(() => {
    onFilter(filterText, filterRol);
  }, [users]);

  return (
    <ManageLayout
      title={`${rol === ERol.Admin ? "Gestionar u" : "U"}suarios`}
      subTitle="¡Todos nuestros usuarios!"
      controls={<UserControl rol={rol} onFilter={onFilter} />}
      list={
        <GridLayout list={list} type={1} defaultText="No hay usuarios!!!" />
      }
    />
  );
};

export default UserManagement;
