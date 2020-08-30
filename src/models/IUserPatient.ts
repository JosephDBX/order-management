import { IBase } from "./IBase";

export interface IUserPatient extends IBase {
  user: string;
  patient: string;
}
