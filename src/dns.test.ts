import { describe, it } from 'vitest';
import { RecordType, numericToStr } from './dns';

describe('dns', () => {
  it("should correctly convert a numeric DNS value to the appropriate enum value", ({ expect }) => {
    const num = 28;
    const want = RecordType.AAAA;
    const got = numericToStr(num);
    expect(got).toBe(want);
  })
})
