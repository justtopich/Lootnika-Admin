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

export interface ILogRecod {
  key: string,
  title: string,
  content: JSX.Element,
  init: boolean,
  end: number,
  offsetStart: number,
  offsetEnd: number,
  loading: boolean,
  hasMore: boolean,
  records: string[] | []
}

export interface ILogRecods {
  [key: string]: ILogRecod
}
