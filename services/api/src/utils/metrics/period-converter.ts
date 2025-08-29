export function getFromDate(period: string): Date {
  const fromDate = new Date();

  switch (period) {
    case "1d":
      fromDate.setDate(fromDate.getDate() - 1);
      break;
    case "7d":
      fromDate.setDate(fromDate.getDate() - 7);
      break;
    case "30d":
      fromDate.setDate(fromDate.getDate() - 30);
      break;
    case "1M":
      fromDate.setMonth(fromDate.getMonth() - 1);
      break;
    case "3M":
      fromDate.setMonth(fromDate.getMonth() - 3);
      break;
    case "6M":
      fromDate.setMonth(fromDate.getMonth() - 6);
      break;
    case "1y":
      fromDate.setFullYear(fromDate.getFullYear() - 1);
      break;
    default:
      throw new Error(`Unsupported period: ${period}`);
  }

  return fromDate;
}
