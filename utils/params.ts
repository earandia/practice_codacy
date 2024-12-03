import { RequestParams } from "./../types/index";
import { Schema } from "express-validator";
import { assignAuthorization } from "./../utils/validators";
import { IOptionsDefault } from "./../interfaces/IExpressValidation";
export const get_param = (req: RequestParams, key: string): any | undefined => {
  if (key && typeof key !== "object") {
    if (req.body && req.body[key] !== undefined) {
      return req.body[key];
    } else if (req.params && req.params[key] !== undefined) {
      return req.params[key];
    } else if (req.query && req.query[key] !== undefined) {
      return req.query[key];
    } else if (req.files && req.files[key] !== undefined) {
      return req.files[key];
    } else if (req.headers && req.headers[key] !== undefined) {
      return req.headers[key];
    }
  }
  return undefined;
};
export const params = <T extends Record<string, any>>(
  params: T,
  req: RequestParams
): Partial<T> => {
  const filtered_params: Partial<T> = {};

  for (const key in params) {
    const value = get_param(req, key);
    if (value !== undefined) {
      filtered_params[key] = value;
    }
  }

  return filtered_params;
};

/**
 * Formats a validation schema, applying default rules and custom options.
 * 
 * @param {Schema | any} schema - The validation schema to be formatted. It can be an object containing validation rules.
 * @param {IOptionsDefault} [options={ base_schema: "", authorization: false, base_schema_exclude: [] }] - Options to customize the validation:
 *  - `base_schema` (string): The name of the base key for nesting validations. Defaults to an empty string.
 *  - `authorization` (boolean): If `true`, applies additional authorization configuration to the schema.
 *  - `base_schema_exclude` (array): List of keys to exclude from the base schema.
 * 
 * @returns {t} The formatted schema with applied validation rules and error messages.
 * 
 * @example
 * const schema = {
 *   username: { exists: true, isString: true },
 *   email: { exists: true, isEmail: true },
 * };
 * const options = { base_schema: "user", authorization: true };
 * const formattedSchema = formatterSchema(schema, options);
 */

export const formatterSchema = <t extends Schema>(
  schema: Schema | any,
  options: IOptionsDefault = {
    base_schema: "",
    authorization: false,
    base_schema_exclude: [],
  }
): t => {
  const base_key: string | null = options.base_schema || null;
  let exclude_schema: string[] = options.base_schema_exclude || [];
  const ERROR_MESSAGES: any = {
    exists: { item: true, message: "field is required" },
    notEmpty: { item: true, message: "field cannot be empty" },
    isString: { item: true, message: "field must be a string" },
    isBoolean: { item: true, message: "field must be a boolean" },
    isEmail: { item: true, message: "field must be a valid email" },
    isMobilePhone: {
      item: true,
      message: "field must be a valid phone number",
    },
    isNumeric: { item: true, message: "field must be a number" },
    isInt: { item: true, message: "field must be an integer" },
    isMongoId: { item: true, message: "field must be a valid mongo id" },
  };

  if (base_key) {
    schema[base_key] = {
      exists: {
        errorMessage: `${base_key} is required`,
      },
    };
    exclude_schema = [...exclude_schema, base_key];
  }
  for (const key in schema) {
    Object.keys(schema[key]).forEach((k) => {
      if (ERROR_MESSAGES[k] && schema[key][k] === true) {
        schema[key][k] = {
          errorMessage: ERROR_MESSAGES[k].message,
        };
      }
    });
    if (base_key && !exclude_schema.includes(key)) {
      schema[base_key + "." + key] = schema[key] || {};
      delete schema[key];
    }
  }
  if (options.authorization) {
    const aux = assignAuthorization(schema);
    schema={...aux, ...schema}
  }
  return schema;
};

export const schemaPagination: Schema = {
  page: {
    optional: false,
    customSanitizer: {
      options: (value: number | string) => (value ? Number(value) : 1),
    },
  },
  limit: {
    optional: false,
    customSanitizer: {
      options: (value: number | string) => (value ? Number(value) : 10),
    },
  },
  search: {
    optional: true,
    isString: true,
  },
  sorting_column: {
    optional: true,
    isString: true,
  },
  sorting_order: {
    optional: true,
    isString: true,
  },
  show_all: {
    optional: true,
    isString: true,
  },
};
