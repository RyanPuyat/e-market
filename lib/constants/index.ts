export const APP_SERVER_URL = process.env.NEXT_PUBLIC_APP_SERVER_URL;
export const APP_NAME = 'Emarket';
export const APP_DESCRIPTION = 'A modern ecommerce website';
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
  email: 'ryan@example.com',
  password: '072587',
};

export const signUpDefaultValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(', ')
  : ['Paypal', 'Stripe', 'CashOnDelivery'];
export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || 'Paypal';

export const PAGE_SIZE = Number(process.env.PAGE_SIZE || 12);
