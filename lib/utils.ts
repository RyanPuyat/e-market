import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//Convert Prisma object into a regular js object

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// export function convertToPlainObject<T>(obj: T): T {
//   function convert(value: any): any {
//     if (value instanceof Decimal) {
//       return value.toString();
//     } else if (Array.isArray(value)) {
//       return value.map(convert);
//     } else if (value && typeof value === 'object') {
//       return Object.fromEntries(
//         Object.entries(value).map(([key, val]) => [key, convert(val)])
//       );
//     }
//     return value;
//   }

//   return convert(obj);
// }

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}

// Format errors
/* eslint-disable @typescript-eslint/no-explicit-any */
export function formatError(error: any) {
  if (error.name === 'ZodError') {
    //Handle zod error

    const fieldErrors = error.issues.map((issue: any) => issue.message);
    return fieldErrors.join('. ');
  } else if (
    error.name === 'PrismaClientKnownRequestError' &&
    error.code === 'P2002'
  ) {
    //Handle prisma error
    const field = error.meta?.target ? error.meta.target[0] : 'Field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exist`;
  } else {
    //Handle other error
    return error.message || 'An unknown error occurred.';
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

//Round number to 2 decimal places
export function round2(value: number | string): number {
  const num = typeof value === 'string' ? Number(value) : value;

  if (isNaN(num)) {
    throw new Error('Value is not a valid number');
  }

  return Math.round((num + Number.EPSILON) * 100) / 100;
}

//Currency Formatter

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2,
});

//Format Currency
export function formatCurrency(amount: number | string | null) {
  if (typeof amount === 'number') {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === 'string') {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return 'NaN';
  }
}

//Shorten UUID

export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

//Format date and time

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};
