import { IBase } from "./IBase";
import { IArea } from "./IArea";

export interface ITest extends IBase {
  area: IArea | string;
  name: string;
  alternative?: string;
  cost: number;
  description: string;
  state: boolean;
}
