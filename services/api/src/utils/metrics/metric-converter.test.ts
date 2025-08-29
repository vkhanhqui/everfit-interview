import { convertValue } from "./metric-converter";

describe("Metric converter", () => {
  describe("convertValue - distance", () => {
    it("should convert between all distance units", () => {
      const distanceTests: [string, string, number, number][] = [
        ["meter", "meter", 1, 1],
        ["meter", "centimeter", 1, 100],
        ["meter", "inch", 1, 39.3701],
        ["meter", "feet", 1, 3.28084],
        ["meter", "yard", 1, 1.09361],
        ["centimeter", "meter", 100, 1],
        ["inch", "feet", 12, 1],
        ["yard", "feet", 1, 3],
        ["feet", "inch", 1, 12],
      ];

      distanceTests.forEach(([from, to, value, expected]) => {
        expect(convertValue("distance", from, to, value)).toBeCloseTo(expected);
      });
    });
  });

  describe("convertValue - temperature", () => {
    it("should convert between all temperature units", () => {
      const temperatureTests: [string, string, number, number][] = [
        ["c", "c", 0, 0],
        ["c", "f", 0, 32],
        ["c", "k", 0, 273.15],
        ["f", "c", 32, 0],
        ["f", "k", 32, 273.15],
        ["k", "c", 273.15, 0],
        ["k", "f", 273.15, 32],
      ];

      temperatureTests.forEach(([from, to, value, expected]) => {
        expect(convertValue("temperature", from, to, value)).toBeCloseTo(
          expected
        );
      });
    });
  });

  it("should throw error for unsupported metric type", () => {
    expect(() => convertValue("randomMetricType", "meter", "yard", 10)).toThrow(
      "Unsupported metric type: randomMetricType"
    );
  });
});
