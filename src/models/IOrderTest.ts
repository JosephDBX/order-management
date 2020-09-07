import { IBase } from "./IBase";

export interface IOrderTest extends IBase {
  order: string;
  test: string;
  cost: number;
  state: boolean;
}
