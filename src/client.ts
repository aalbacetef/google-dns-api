import { RecordType, dnsStringTypes, numericToStr } from './dns';
import * as google from './google';
import { Logger, NoopLogger } from './util/logger';
import Ajv, { JSONSchemaType } from "ajv"
import formats from 'ajv-formats-draft2019/formats';

const baseURL = 'https://dns.google.com/resolve';

export class Client {
  logger: Logger;
  showRawResponse: boolean = false;

  constructor(showRawResponse: boolean = false, logger?: Logger) {
    this.showRawResponse = showRawResponse;

    if (typeof logger === 'undefined') {
      logger = new NoopLogger();
    }

    this.logger = logger;
  }

  async do(req: Request): Promise<Response | google.Response> {
    this.logger.log("client.showRawResponse: ", this.showRawResponse);

    const rawRequest = toGoogleRequest(req);
    const params: Params = rawRequest;
    const url = toParams(baseURL, params);

    this.logger.log("url: ", url);

    const resp = await fetch(url, { method: 'GET' });
    this.logger.log("response: ", resp);

    if (resp.status !== 200) {
      throw new BadRequestError(resp.statusText);
    }

    const ct = resp.headers.get("Content-Type");
    if (ct === null) {
      throw new Error("Content-Type header missing from response");
    }

    const data = await resp.json();
    if (this.showRawResponse) {
      return data;
    }

    return fromGoogleResponse(data);
  }
}

class BadRequestError extends Error {
  constructor(statusText: string) {
    super(`failed with status: ${statusText}`);
  }
}

export type ContentType = "application/x-javascript" | "application/dns-message";

export type Request = {
  name: string;
  type: RecordType;
  disableChecking?: boolean;
  contentType?: ContentType;
  DNSSEC?: boolean;
  EDNSClientSubnet?: string;
  randomPadding?: string;
};

function toGoogleRequest(req: Request): google.Request {
  const r: Partial<google.Request> = {
    name: req.name,
    type: req.type,
  };

  if (typeof req.disableChecking !== 'undefined') {
    r.cd = req.disableChecking
  }

  if (typeof req.DNSSEC !== 'undefined') {
    r.do = req.DNSSEC;
  }

  if (typeof req.contentType !== 'undefined') {
    r.ct = req.contentType;
  }

  if (typeof req.EDNSClientSubnet !== 'undefined') {
    r.edns_client_subnet = req.EDNSClientSubnet;
  }

  if (typeof req.randomPadding !== 'undefined') {
    r.random_padding = req.randomPadding;
  }


  return google.newRequest(r);
}


type Params = Partial<Record<keyof google.Request, string | number | boolean>>;

function toParams(url: string, params: Params): string {
  const paramStr = new URLSearchParams(params as Record<string, string>).toString();
  return url + '?' + paramStr;
}

export type Response = {
  status: number;
  isTruncated: boolean;
  isDNSSECValidated: boolean;
  isCheckingDisabled: boolean;
  question: Question[];
  answer?: Answer[];
  comment?: string;
};

type Question = {
  name: string;
  type: string;
};

type Answer = {
  name: string;
  type: string;
  TTL?: number;
  data: string;
};

function fromGoogleResponse(res: google.Response): Response {
  const r: Response = {
    status: res.Status,
    isTruncated: res.TC,
    isDNSSECValidated: res.AD,
    isCheckingDisabled: res.CD,
    question: res.Question.map(q => ({ name: q.name, type: numericToStr(q.type) })),
  };

  if (typeof res.Comment !== 'undefined') {
    r.comment = res.Comment
  }

  if (typeof res.Answer !== 'undefined') {
    r.answer = res.Answer.map(a => ({
      name: a.name,
      type: numericToStr(a.type),
      TTL: a.TTL,
      data: a.data,
    }))
  }

  return r;
}


export class FieldError extends Error {
  field: string;
  reason: string;

  constructor(field: string, reason: string) {
    super(`error in field "${field}" => ${reason}`);

    this.field = field;
    this.reason = reason;
  }
}

const ajv = new Ajv({ formats });

const requestSchema: JSONSchemaType<Request> = {
  type: 'object',
  properties: {
    name: { type: 'string', format: 'idn-hostname' },
    type: { type: 'string', enum: dnsStringTypes as readonly RecordType[] },
    disableChecking: { type: 'boolean', nullable: true },
    contentType: { type: 'string', enum: ["application/x-javascript", "application/dns-message"], nullable: true },
    DNSSEC: { type: 'boolean', nullable: true },
    EDNSClientSubnet: { type: 'string', nullable: true },
    randomPadding: { type: 'string', nullable: true },
  },
  required: ["name", "type"],
  additionalProperties: false,
};


const validateSchema = ajv.compile(requestSchema);

export function assertValidRequest(req: Request): void {
  const schemaIsValid = validateSchema(req);
  if (!schemaIsValid) {
    // will return the first error
    (validateSchema.errors || []).forEach(err => {
      throw new FieldError(
        err.instancePath.replace('/', ''),
        err.message!,
      );
    });
    throw new Error("invalid schema");
  }

  if (typeof req.EDNSClientSubnet === 'string' && req.EDNSClientSubnet.trim().length === 0) {
    throw new FieldError("EDNSClientSubnet", "cannot be empty if set")
  }
}

