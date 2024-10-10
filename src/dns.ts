export enum RecordType {
  A = "A",
  AAAA = "AAAA",
  CAA = "CAA",
  CDNSKEY = "CDNSKEY",
  CDS = "CDS",
  CERT = "CERT",
  CNAME = "CNAME",
  DNAME = "DNAME",
  DNSKEY = "DNSKEY",
  DS = "DS",
  HINFO = "HINFO",
  HTTPS = "HTTPS",
  IPSECKEY = "IPSECKEY",
  KEY = "KEY",
  MX = "MX",
  NAPTR = "NAPTR",
  NS = "NS",
  NSEC = "NSEC",
  NSEC3 = "NSEC3",
  NSEC3PARAM = "NSEC3PARAM",
  PTR = "PTR",
  RRSIG = "RRSIG",
  RP = "RP",
  SIG = "SIG",
  SOA = "SOA",
  SRV = "SRV",
  SSHFP = "SSHFP",
  SVCB = "SVCB",
  TLSA = "TLSA",
  TSIG = "TSIG",
  TXT = "TXT",

  // Google specific
  ANY = "ANY",
}


export const dnsStringTypes = [
  'A',
  'AAAA',
  'CAA',
  'CDNSKEY',
  'CDS',
  'CERT',
  'CNAME',
  'DNAME',
  'DNSKEY',
  'DS',
  'HINFO',
  'HTTPS',
  'IPSECKEY',
  'KEY',
  'MX',
  'NAPTR',
  'NS',
  'NSEC',
  'NSEC3',
  'NSEC3PARAM',
  'PTR',
  'RRSIG',
  'RP',
  'SIG',
  'SOA',
  'SRV',
  'SSHFP',
  'SVCB',
  'TLSA',
  'TSIG',
  'TXT',

  // Google specific
  'ANY',
];

const dnsNumericTypes = [
  '1',
  '28',
  '257',
  '60',
  '59',
  '37',
  '5',
  '39',
  '48',
  '43',
  '13',
  '65',
  '45',
  '25',
  '15',
  '35',
  '2',
  '47',
  '50',
  '51',
  '12',
  '46',
  '17',
  '24',
  '6',
  '33',
  '44',
  '64',
  '52',
  '250',
  '16',

  // Google specific
  '255',
];


export function lookupType(dnsType: string): boolean {
  for (const key in Object.keys(RecordType)) {
    if (dnsType === dnsNumericTypes[key]) {
      return true;
    }

    if (dnsType === dnsStringTypes[key]) {
      return true;
    }
  }

  return false;
}

export function numericToStr(dnsType: string | number): string {
  if (typeof dnsType === 'number') {
    dnsType = dnsType + '';
  }

  const index = dnsNumericTypes.indexOf(dnsType);
  if (index === -1) {
    return dnsType;
  }

  return dnsStringTypes[index];
}
