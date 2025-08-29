const distanceFactors = new Map<string, number>([
  ["meter", 1],
  ["centimeter", 0.01],
  ["inch", 0.0254],
  ["feet", 0.3048],
  ["yard", 0.9144],
]);

function convertDistance(value: number, from: string, to: string): number {
  const fromFactor = distanceFactors.get(from);
  const toFactor = distanceFactors.get(to);

  if (!fromFactor || !toFactor) {
    throw new Error(`Unsupported distance unit: ${from} or ${to}`);
  }

  return (value * fromFactor) / toFactor;
}

function convertTemperature(value: number, from: string, to: string): number {
  if (from === to) return value;

  let kelvin: number;
  switch (from) {
    case "c":
      kelvin = value + 273.15;
      break;
    case "f":
      kelvin = (value - 32) * (5 / 9) + 273.15;
      break;
    case "k":
      kelvin = value;
      break;
    default:
      throw new Error(`Unsupported temperature unit: ${from}`);
  }

  switch (to) {
    case "c":
      return kelvin - 273.15;
    case "f":
      return (kelvin - 273.15) * (9 / 5) + 32;
    case "k":
      return kelvin;
    default:
      throw new Error(`Unsupported temperature unit: ${to}`);
  }
}

export function convertValue(
  metricType: string,
  curUnit: string,
  toUnit: string,
  value: number
) {
  let finalValue = value;

  switch (metricType) {
    case "distance":
      finalValue = convertDistance(value, curUnit, toUnit);
      break;

    case "temperature":
      finalValue = convertTemperature(value, curUnit, toUnit);
      break;

    default:
      throw new Error(`Unsupported metric type: ${metricType}`);
  }

  return finalValue;
}
