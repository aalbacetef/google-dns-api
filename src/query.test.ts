import { readFileSync } from 'fs';
import path from 'path';
import { describe, ExpectStatic, it } from 'vitest';
import { query, queryMX, queryTXT } from './query';
import { RecordType } from './dns';
import { Response } from './client';


describe("query", () => {
  it("should fetch the A record correctly", async ({ expect }) => {
    const resp = await query('example.com', RecordType.A) as Response
    compareRequest(resp, "query.a.json", expect);
  });

  it("should fetch the MX record correctly", async ({ expect }) => {
    const resp = await queryMX("example.com");
    compareRequest(resp, "query.mx.json", expect);
  });

  it("should fetch the TXT record correctly", async ({ expect }) => {
    const resp = await queryTXT("example.com");
    compareRequest(resp, "query.txt.json", expect);
  });
})

function compareRequest(resp: Response, file: string, expect: ExpectStatic): void {
  const f = readFileSync(
    path.join(__dirname, "testdata", file),
    { encoding: 'utf8', flag: 'r' },
  );
  const o: Response = JSON.parse(f);

  type HasData = { data: string };

  const sortFn = (a: HasData, b: HasData): number => {
    if (a.data > b.data) { return 1; }
    if (a.data === b.data) { return 0; }

    return -1;
  }

  // we equal the TTL fields as they will differ.
  resp.answer!.sort(sortFn);
  o.answer!.sort(sortFn);

  o.answer!.forEach((a, k) => a.TTL = resp.answer![k]!.TTL)

  expect(resp).toStrictEqual(o);
}
