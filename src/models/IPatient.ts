import { IBase } from "./IBase";

export interface IPatient extends IBase {
  name: string;
  surname: string;
  birthDate: string;
  ind?: string;
  sex: boolean;
  contact: IContact;
}

export interface IContact {
  phoneNumber: string;
  address: string;
  email?: string;
}
