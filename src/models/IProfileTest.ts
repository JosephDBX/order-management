import { IBase } from "./IBase";
import { IProfile } from "./IProfile";
import { ITest } from "./ITest";

export interface IProfileTest extends IBase {
  profile: string;
  test: string;
  cost: number;
  state: boolean;
}
