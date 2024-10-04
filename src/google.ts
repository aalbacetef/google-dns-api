
import { RecordType } from './dns';

export interface Request {
  name: string;
  type?: string;
  cd?: boolean;
  ct?: string;
  do?: boolean;
  edns_client_subnet?: string;
  random_padding?: string;
}

export const defaultRequest: Partial<Request> = {
  type: RecordType.A,
  cd: false,
  ct: '',
  do: false,
};

export function newRequest(req: Partial<Request>): Request {
  return {
    name: req.name!,
    ...defaultRequest,
    ...req,
  };
}

export interface Question {
  name: string;
  type: number;
}

export interface Answer {
  name: string;
  type: number;
  TTL?: number;
  data: string;
}

export interface Response {
  Status: number;
  TC: boolean;
  RD: boolean;
  RA: boolean;
  AD: boolean;
  CD: boolean;
  Question: Question[];
  Answer?: Answer[];
  Comment?: string;
}

