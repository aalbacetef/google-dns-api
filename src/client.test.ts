import { describe, it } from 'vitest';
import { assertValidRequest, FieldError } from './client';
import { RecordType } from './dns';

describe("request", async () => {
  it("asserts name must be in a valid format", ({ expect }) => {
    const req = { name: "aaó$", type: RecordType.A };
    const want = new FieldError("name", `must match format "idn-hostname"`);

    expect(() => assertValidRequest(req)).toThrowError(want);
  });

  it("asserts name cannot be empty", ({ expect }) => {
    const req = {
      name: "",
      type: RecordType.A,
    };
    const want = new FieldError("name", `must match format "idn-hostname"`);
    expect(() => assertValidRequest(req)).toThrowError(want);
  });

  it("asserts type must be a valid DNS Record type", ({ expect }) => {
    const req = {
      name: "valid.host",
      type: 'invalid',
    }
    const want = new FieldError(
      "type",
      "must be equal to one of the allowed values",
    );
    // @ts-expect-error: we're checking for a type error so no need to set this.
    expect(() => assertValidRequest(req)).toThrowError(want);
  });

  it("asserts EDNSClientSubnet cannot be set and empty", ({ expect }) => {
    const req = {
      name: "valid.host",
      type: RecordType.A,
      EDNSClientSubnet: ""
    };
    const want = new FieldError(
      "EDNSClientSubnet",
      "cannot be empty if set",
    );
    expect(() => assertValidRequest(req)).toThrowError(want);
  });
});
