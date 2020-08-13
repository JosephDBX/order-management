import React from "react";
import { ERol } from "../../models/ERol";
import { IRole } from "../../models/IUser";

interface IUserControlProps {
  rol: ERol;
  onFilter(ft: string, fr: IRole): void;
}

const UserControl: React.FunctionComponent<IUserControlProps> = ({
  rol,
  onFilter,
}) => {
  return <div>UserControl</div>;
};

export default UserControl;
