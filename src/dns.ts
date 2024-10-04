export enum RecordType {
  A = "A",
  AAAA = "AAAA",
  AFSDB = "AFSDB",
  APL = "APL",
  CAA = "CAA",
  CDNSKEY = "CDNSKEY",
  CDS = "CDS",
  CERT = "CERT",
  CNAME = "CNAME",
  CSYNC = "CSYNC",
  DHCID = "DHCID",
  DLV = "DLV",
  DNAME = "DNAME",
  DNSKEY = "DNSKEY",
  DS = "DS",
  EUI48 = "EUI48",
  EUI64 = "EUI64",
  HINFO = "HINFO",
  HIP = "HIP",
  HTTPS = "HTTPS",
  IPSECKEY = "IPSECKEY",
  KEY = "KEY",
  KX = "KX",
  LOC = "LOC",
  MX = "MX",
  NAPTR = "NAPTR",
  NS = "NS",
  NSEC = "NSEC",
  NSEC3 = "NSEC3",
  NSEC3PARAM = "NSEC3PARAM",
  OPENPGPKEY = "OPENPGPKEY",
  PTR = "PTR",
  RRSIG = "RRSIG",
  RP = "RP",
  SIG = "SIG",
  SMIMEA = "SMIMEA",
  SOA = "SOA",
  SRV = "SRV",
  SSHFP = "SSHFP",
  SVCB = "SVCB",
  TA = "TA",
  TKEY = "TKEY",
  TLSA = "TLSA",
  TSIG = "TSIG",
  TXT = "TXT",
  URI = "URI",
  ZONEMD = "ZONEMD",

  // Google specific
  ANY = "ANY",
}


export const dnsStringTypes = [
  'A',
  'AAAA',
  'AFSDB',
  'APL',
  'CAA',
  'CDNSKEY',
  'CDS',
  'CERT',
  'CNAME',
  'CSYNC',
  'DHCID',
  'DLV',
  'DNAME',
  'DNSKEY',
  'DS',
  'EUI48',
  'EUI64',
  'HINFO',
  'HIP',
  'HTTPS',
  'IPSECKEY',
  'KEY',
  'KX',
  'LOC',
  'MX',
  'NAPTR',
  'NS',
  'NSEC',
  'NSEC3',
  'NSEC3PARAM',
  'OPENPGPKEY',
  'PTR',
  'RRSIG',
  'RP',
  'SIG',
  'SMIMEA',
  'SOA',
  'SRV',
  'SSHFP',
  'SVCB',
  'TA',
  'TKEY',
  'TLSA',
  'TSIG',
  'TXT',
  'URI',
  'ZONEMD',

  // Google specific
  'ANY',
];

const dnsNumericTypes = [
  '1',
  '28',
  '18',
  '42',
  '257',
  '60',
  '59',
  '37',
  '5',
  '62',
  '49',
  '32769',
  '39',
  '48',
  '43',
  '108',
  '109',
  '13',
  '55',
  '65',
  '45',
  '25',
  '36',
  '29',
  '15',
  '35',
  '2',
  '47',
  '50',
  '51',
  '61',
  '12',
  '46',
  '17',
  '24',
  '53',
  '6',
  '33',
  '44',
  '64',
  '32768',
  '249',
  '52',
  '250',
  '16',
  '256',
  '63',

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
