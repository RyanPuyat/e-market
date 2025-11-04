import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//Convert Prisma object into a regular js object

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

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
