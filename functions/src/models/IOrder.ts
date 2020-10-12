import { IBase } from "./IBase";

export interface IOrder extends IBase {
  user?: string;
  patient: string;
  attendingDoctor?: string;
  orderedTo: string;
  delivery?: number;
  subTotal: number;
  discount?: number;
  description?: string;
  state: string;
}
