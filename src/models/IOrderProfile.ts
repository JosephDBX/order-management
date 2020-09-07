import { IBase } from "./IBase";

export interface IOrderProfile extends IBase {
  order: string;
  profile: string;
  cost: number;
  state: boolean;
}
