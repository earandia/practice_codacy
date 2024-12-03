import { Response } from "express";
import { ErrorFormatter, ValidationError } from "express-validator";
import { Errors } from "../interfaces";
import config from "../config/variables";

//format errors

/**
 * Formats error messages from express-validator into a Record<string, string[]>
 * where the keys are the field names and the values are arrays of error messages.
 *
 * @param errors - The error messages from express-validator.
 * @returns A Record with the field names as keys and arrays of error messages as values.
 */
function formats_errors(errors: Errors): Record<string, string[]> {
  const error_messages: Record<string, string[]> = {};

  if (Array.isArray(errors.errors)) {
    for (const error of errors.errors) {
      if (typeof error === "object" && error !== null) {
        const key = error?.path;
        if (key != undefined) {
          if (!error_messages[key]) {
            error_messages[key] = [];
          }

          error_messages[key].push(error.msg ?? "");
        }
      }
    }
  } else if (typeof errors.errors === "string") {
    error_messages["general"] = [errors.errors];
  } else if (typeof errors === "object" && errors !== null) {
    const error = errors as { type: string; msg: string; path: string };
    if (error.type === "field") {
      const key = error?.path;

      if (!error_messages[key]) {
        error_messages[key] = [];
      }

      error_messages[key].push(error.msg);
    }
  }

  return error_messages;
}

//for errors
export const response_error = (
  res: Response,
  errors: Errors | string
): void => {
  res.status(409).json({
    code: config.codes.error,
    message: typeof errors === "object" ? formats_errors(errors) : errors,
  });
};

/**
 * Handles and formats validation errors, then sends the response to the client.
 * If any validation errors are found, they are grouped and returned in the response.
 * If the error is related to "authorization", a 401 Unauthorized response is sent.
 * Otherwise, a 409 Conflict response with the formatted error messages is returned.
 *
 * @param {Response} res - The Express response object, used to send the response to the client.
 * @param {any} errors - The validation errors from express-validator.
 *   These errors contain the details of invalid fields in the request.
 *
 * @returns {void} - This function sends a response and does not return any value.
 *
 * @example
 * // Example usage in a controller:
 * controller_validation(res, errors);
 */

export const controller_validation = (res: Response, errors: any): void => {
  const errorFormatter: ErrorFormatter = (error: ValidationError | any) => ({
    [error.path]: error.msg,
  });

  // Format errors using the error formatter
  const error_formatter = errors.formatWith(errorFormatter);
  const sample_error = error_formatter.array().map((obj: any) => {
    const newObj: any = {};
    Object.entries(obj).forEach(([key, value]) => {
      const newKey = key.includes(".") ? key.split(".")[1] : key;
      newObj[newKey] = value;
    });

    return newObj;
  });
  // Group errors by field name
  const groupedErrors = sample_error.reduce((acc: any, cur: any) => {
    const key = Object.keys(cur)[0];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(cur[key]);
    return acc;
  }, {} as { [key: string]: string[] });

  // If "authorization" error, send unauthorized response
  if (groupedErrors["authorization"]) {
    return response_unauthorized(res);
  }

  // Return the error response with a 409 Conflict status
  res.status(409).json({
    code: config.codes.error,
    errors: groupedErrors,
  });
};

//for unauthorized access
export const response_unauthorized = (res: Response): void => {
  res.status(401).json({
    code: config.codes.unauthorized,
    errors: "Unauthorized",
  });
};

//Success
export const response_success = (
  res: Response,
  data: any = {}
): Response<any, Record<string, any>> => {
  if (typeof data === "object") {
    return res.json({
      code: config.codes.success,
      ...data,
    });
  } else {
    return res.json({
      code: config.codes.success,
      message: data,
    });
  }
};

export const response_error_register_apple = (
  res: Response
): Response<any, Record<string, any>> => {
  return res.status(409).json({
    code: config.codes.error,
    detail: "Register apple required email",
  });
};

// Errors
export const errors = (errors: Errors): Record<string, string[]> => {
  return formats_errors(errors);
};
