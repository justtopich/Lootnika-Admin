import { History } from "history";
import { match } from "react-router-dom";

export type Props = {
  history: History;
  location: Location;
  match: match;
};

export type Res =
  | {
      status: number;
      data?: any;
      message?: string;
    }
  | undefined;

export interface LooseObject {
    [key: string]: any
}
