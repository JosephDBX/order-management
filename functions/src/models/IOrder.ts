import { IBase } from "./IBase";
import { IUser } from "./IUser";
import { IPatient } from "./IPatient";

export interface IOrder extends IBase {
  user?: IUser | string;
  patient: IPatient | string;
  orderedTo: string;
  delivery?: number;
  subTotal: number;
  discount?: number;
  paymentType: string; // default "card"
  description?: string;
  result?: string; // document URL
  state: string;
}
