import { d3Shots } from "../client/js/components/d3Shots"

describe('shots', () => {
  it('should calculate scales', () => {
    const scales = d3Shots._scales();
    expect(scales).not.toBe(null);
  });
});
