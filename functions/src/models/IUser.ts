import { IBase } from "./IBase";

export interface IUser extends IBase {
  uid?: string;
  email: string;
  roles?: IRole;
}

export interface IRole {
  isDeliveryWorker?: boolean;
  isDoctor?: boolean;
  isReceptionist?: boolean;
  isLaboratorist?: boolean;
  isAdmin?: boolean;
}
