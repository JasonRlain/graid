export default function convertToBytes(value: string, unit?: string) {
  const numericValue = parseFloat(value);
  switch (unit) {
    case "PiB":
      return numericValue * 1024 ** 5;
    case "TiB":
      return numericValue * 1024 ** 4;
    case "GiB":
      return numericValue * 1024 ** 3;
    case "MiB":
      return numericValue * 1024 ** 2;
    default:
      return numericValue;
  }
}
export function reverse(value: string) {
  const numericValue = parseFloat(value);
  let dividend = numericValue;
  let timer = 0;
  let unit = "";
  while (dividend > 1023) {
    timer++;
    dividend = dividend / 1024;
  }
  if (timer >= 5) {
    unit = "PiB";
  } else if (timer >= 4) {
    unit = "TiB";
  } else if (timer >= 3) {
    unit = "GiB";
  } else if (timer >= 2) {
    unit = "MiB";
  }

  return { value: dividend, unit: unit };
}
