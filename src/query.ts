import { Client, ContentType, Request, Response } from './client';
import { RecordType } from './dns';
import * as google from './google';

type Options = {
  client?: Client;
  disableChecking?: boolean;
  contentType?: ContentType;
  DNSSEC?: boolean;
  EDNSClientSubnet?: string;
  randomPadding?: string;
};

const defaultOptions: Options = {
  disableChecking: false,
  contentType: "application/x-javascript",
  DNSSEC: false,
  randomPadding: '',
};

export function query(name: string, dnsRecordType: RecordType, options: Options = defaultOptions): Promise<Response | google.Response> {
  let client = options.client;
  if (typeof client === 'undefined' || !(client instanceof Client)) {
    client = new Client();
  }

  if (options.contentType === "application/dns-message") {
    throw new NotSupportedError("binary dns message not yet supported");
  }

  const req: Request = {
    name,
    type: dnsRecordType,
    disableChecking: options.disableChecking,
    contentType: options.contentType,
    DNSSEC: options.DNSSEC,
    EDNSClientSubnet: options.EDNSClientSubnet,
    randomPadding: options.randomPadding,
  };

  return client.do(req);
}

export class NotSupportedError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export function queryA(name: string): Promise<Response> {
  return query(name, RecordType.A) as Promise<Response>;
}

export function queryMX(name: string): Promise<Response> {
  return query(name, RecordType.MX) as Promise<Response>;
}

export function queryTXT(name: string): Promise<Response> {
  return query(name, RecordType.TXT) as Promise<Response>;
}

