import { IBase } from "./IBase";

export interface IOrder extends IBase {
  user?: string;
  patient: string;
  orderedTo: string;
  delivery?: number;
  subTotal: number;
  discount?: number;
  paymentType: string; // default "card"
  description?: string;
  result?: string; // document URL
  state: string;
}
