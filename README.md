![CI status](https://github.com/aalbacetef/google-dns-api-wip/actions/workflows/ci.yml/badge.svg)   [![License](https://img.shields.io/badge/License-BSD_3--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause) [![npm version](https://img.shields.io/npm/v/google-dns-api.svg)](https://www.npmjs.com/package/google-dns-api)

# google-dns-api


A TypeScript wrapper for Google's DNS over HTTPS (DoH) JSON API. 

This package allows you to easily perform DNS queries (e.g. A, AAAA, MX, etc.) directly from your web application without the need for a backend server or browser extensions.

## Features

- **TypeScript support**: Fully typed API, offering great autocompletion and type safety when using modern IDEs.
- **Simple to use**: Perform DNS queries with just a few lines of code. It also offers nicer and clearer wrappers the Google Request and Response objects.
- **No backend required**: Directly query Google's DNS API from the browser.
- **Supports multiple DNS record types**: Query for `A`, `AAAA`, `MX`, `TXT`, `CNAME`, and more (all 48 record types supported by Google).

## Installation

You can install the package via npm:

```bash
npm install google-dns-api
```

Or using Bun:

```bash
bun add google-dns-api
```

## Usage

Here’s a simple example of how to use the `google-dns-api` package to perform DNS queries.

### Use the query() method 

```typescript
import { query, RecordType } from 'google-dns-api';


query('example.com', RecordType.NS)
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });
```

and the response would be: 

```typescript
{
  status: 0,
  isTruncated: false,
  isDNSSECValidated: true,
  isCheckingDisabled: false,
  question: [ { name: 'example.com.', type: 'NS' } ],
  answer: [
    {
      name: 'example.com.',
      type: 'NS',
      TTL: 4399,
      data: 'b.iana-servers.net.'
    },
    {
      name: 'example.com.',
      type: 'NS',
      TTL: 4399,
      data: 'a.iana-servers.net.'
    }
  ]
}
```

### Response 

The Response type is a convenience wrapper:

```typescript
type Response = {
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
```

### Helpers 

There are helpers for common RecordTypes (A, TXT, MX).

```typescript
import { queryA, queryMX, queryTXT } from 'google-dns-api';

queryA('example.com')
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

queryMX('example.com')
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

queryTXT('example.com')
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
```

### Options

The `query` function also supports being passed in an `Options` object:

```typescript
type Options = {
  client?: Client;
  disableChecking?: boolean;
  contentType?: ContentType;
  DNSSEC?: boolean;
  EDNSClientSubnet?: string;
  randomPadding?: string;
};
```

Information about each option (which can be read fully on the Google API docs: [link](https://developers.google.com/speed/public-dns/docs/doh/json)).

##### client 

default: omitted 

Use this option to pass in a client (more on clients below). This is useful if you have set a custom logger on the client.


##### disableChecking 

default: false

If true, disables DNSSEC validation.

##### contentType 

default: "application/x-javascript"

If set to `application/x-javascript`, you will have the response in JSON format. Use `application/dns-message` to receive a binary DNS message in the response HTTP body instead of JSON text (Note: this is not currently supported via the `query` or `Client`.

##### DNSSEC

default: false

If true, the response will include DNSSEC records (RRSIG, NSEC, NSEC3).

##### EDNSClientSubnet 

default: omitted 

Format is an IP address with a subnet mask. Examples: 1.2.3.4/24, 2001:700:300::/48.

If you are using DNS-over-HTTPS because of privacy concerns, and do not want any part of your IP address to be sent to authoritative name servers for geographic location accuracy, use edns_client_subnet=0.0.0.0/0. Google Public DNS normally sends approximate network information (usually zeroing out the last part of your IPv4 address).

##### randomPadding 

The value of this parameter is ignored. Example: XmkMw~o_mgP2pf.gpw-Oi5dK.

API clients concerned about possible side-channel privacy attacks using the packet sizes of HTTPS GET requests can use this to make all requests exactly the same size by padding requests with random data. To prevent misinterpretation of the URL, restrict the padding characters to the unreserved URL characters: upper- and lower-case letters, digits, hyphen, period, underscore and tilde.

### Client 

There is also a `Client` class, which supports passing in a `Logger` as well as setting `showRawResponse` to not return this package's wrapper `Response` but Google's. 

The constructor has the signature:

```typescript
constructor(showRawResponse: boolean = false, logger?: Logger)
```

Loggers implement the interface:

```typescript
type LogFunc = (...params: Value[]) => void;

interface Logger {
  log: LogFunc;
  error: LogFunc;
}
```

A few convenience loggers are provided: 

- `NoopLogger`: ignores all log/error calls
- `ConsoleLogger`: passes log calls to `console.log` and error calls to `console.error`
- `FnLogger`: takes in a function which will be called on every log and error call.

#### Usage of FnLogger 

```typescript

type Which = "log" | "error";

const myFunc = (which: Which, ...params: Value[]) => {
  // do something with this 
}

const logger = new FnLogger(fn);
logger.log("something"); // will call myFunc("log", "something")
```

### Using the Client 

The client has a method `do` with the signature:

```typescript 
async do(req: Request): Promise<Response | google.Response>
```

The `Request` is the package's wrapper around Google's request:

```typescript
type Request = {
  name: string;
  type: RecordType;
  disableChecking?: boolean;
  contentType?: "application/x-javascript" | "application/dns-message";
  DNSSEC?: boolean;
  EDNSClientSubnet?: string;
  randomPadding?: string;
}
```


## Contributing

Contributions are welcome! Please open an issue or submit a pull request to suggest improvements or add new features.


## Acknowledgements

This project uses the [Google DNS-over-HTTPS API](https://developers.google.com/speed/public-dns/docs/doh/json).

---

Happy querying! 🎉

