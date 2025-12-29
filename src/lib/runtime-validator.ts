/**
 * Runtime Validation Utilities
 * 
 * Provides type-safe runtime validation for API responses and external data.
 * Prevents runtime errors from invalid data shapes.
 */

import { toast } from "sonner";

/**
 * Validation result type
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

/**
 * Schema validator function type
 */
export type ValidatorFn<T> = (data: unknown) => ValidationResult<T>;

/**
 * Creates a validator that checks if value is a string
 */
export const string = (): ValidatorFn<string> => {
  return (data: unknown): ValidationResult<string> => {
    if (typeof data === 'string') {
      return { success: true, data };
    }
    return { 
      success: false, 
      errors: [`Expected string, got ${typeof data}`] 
    };
  };
};

/**
 * Creates a validator that checks if value is a number
 */
export const number = (): ValidatorFn<number> => {
  return (data: unknown): ValidationResult<number> => {
    if (typeof data === 'number' && !isNaN(data)) {
      return { success: true, data };
    }
    return { 
      success: false, 
      errors: [`Expected number, got ${typeof data}`] 
    };
  };
};

/**
 * Creates a validator that checks if value is a boolean
 */
export const boolean = (): ValidatorFn<boolean> => {
  return (data: unknown): ValidationResult<boolean> => {
    if (typeof data === 'boolean') {
      return { success: true, data };
    }
    return { 
      success: false, 
      errors: [`Expected boolean, got ${typeof data}`] 
    };
  };
};

/**
 * Creates a validator for optional values
 */
export const optional = <T>(validator: ValidatorFn<T>): ValidatorFn<T | undefined> => {
  return (data: unknown): ValidationResult<T | undefined> => {
    if (data === undefined || data === null) {
      return { success: true, data: undefined };
    }
    return validator(data);
  };
};

/**
 * Creates a validator for arrays
 */
export const array = <T>(itemValidator: ValidatorFn<T>): ValidatorFn<T[]> => {
  return (data: unknown): ValidationResult<T[]> => {
    if (!Array.isArray(data)) {
      return { 
        success: false, 
        errors: [`Expected array, got ${typeof data}`] 
      };
    }

    const results: T[] = [];
    const errors: string[] = [];

    for (let i = 0; i < data.length; i++) {
      const result = itemValidator(data[i]);
      if (result.success && result.data !== undefined) {
        results.push(result.data);
      } else {
        errors.push(`Item ${i}: ${result.errors?.join(', ')}`);
      }
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    return { success: true, data: results };
  };
};

/**
 * Creates a validator for objects with specific shape
 */
export const object = <T extends Record<string, any>>(
  schema: { [K in keyof T]: ValidatorFn<T[K]> }
): ValidatorFn<T> => {
  return (data: unknown): ValidationResult<T> => {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      return { 
        success: false, 
        errors: [`Expected object, got ${typeof data}`] 
      };
    }

    const result = {} as T;
    const errors: string[] = [];

    for (const key in schema) {
      const validator = schema[key];
      const value = (data as any)[key];
      const fieldResult = validator(value);

      if (fieldResult.success && fieldResult.data !== undefined) {
        result[key] = fieldResult.data;
      } else {
        errors.push(`Field '${key}': ${fieldResult.errors?.join(', ')}`);
      }
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    return { success: true, data: result };
  };
};

/**
 * Validates API response and shows error toast on failure
 */
export const validateApiResponse = <T>(
  data: unknown,
  validator: ValidatorFn<T>,
  options: {
    showToast?: boolean;
    context?: string;
  } = {}
): T | null => {
  const result = validator(data);

  if (!result.success) {
    const context = options.context || 'API Response';
    const errorMsg = `${context} validation failed: ${result.errors?.join(', ')}`;
    
    if (import.meta.env.DEV) {
      console.error(errorMsg, data);
    }

    if (options.showToast !== false) {
      toast.error(`Erro ao processar dados: ${context}`);
    }

    return null;
  }

  return result.data || null;
};

/**
 * Example usage:
 * 
 * // Define schema
 * const ProductSchema = object({
 *   id: string(),
 *   name: string(),
 *   price: number(),
 *   inStock: boolean(),
 *   tags: optional(array(string())),
 * });
 * 
 * // Validate API response
 * const product = validateApiResponse(
 *   apiData,
 *   ProductSchema,
 *   { context: 'Product data' }
 * );
 * 
 * if (product) {
 *   // product is typed and safe to use
 *   console.log(product.name);
 * }
 */
