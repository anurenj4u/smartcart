import type { ShippingDetails, ShippingErrors } from '../types';

const POSTAL_CODE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/;

export function validateShipping(details: ShippingDetails): ShippingErrors {
  const errors: ShippingErrors = {};

  if (details.fullName.trim().length < 2) {
    errors.fullName = 'Enter your full name.';
  }

  if (details.address.trim().length < 5) {
    errors.address = 'Enter your street address.';
  }

  if (details.city.trim().length < 2) {
    errors.city = 'Enter your city.';
  }

  if (!POSTAL_CODE_PATTERN.test(details.postalCode.trim())) {
    errors.postalCode = 'Enter a valid postal code.';
  }

  return errors;
}
