import { IBase } from "./IBase";

export interface IProfileTest extends IBase {
  profile: string;
  test: string;
  cost: number;
  state: boolean;
}
