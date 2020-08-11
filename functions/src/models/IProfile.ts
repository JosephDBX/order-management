import { IBase } from "./IBase";

export interface IProfile extends IBase {
  name: string;
  alternative?: string;
  description: string;
  state: boolean;
}
