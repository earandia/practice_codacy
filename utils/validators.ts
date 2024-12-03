import { Headers } from './../node_modules/gaxios/build/src/common.d';
import mongoose from "mongoose";
import { getTokenValue } from "./jwt";
import { Schema } from "express-validator";
import { get_param } from "./params";
import { response_unauthorized } from "./format";
import { userEmailMustExist, userEmailMustNotExist } from './validationCustoms';

type Request = {
  body: { [key: string]: any };
  current_user?: any;
};

type Response = {
  status: (statusCode: number) => Response;
  json: (body: any) => void;
};

/**
 * Validate if the request has a valid access token.
 * @param keyNames comma-delimited string of keys to check in the request.
 * @param req Express request object.
 * @param res Express response object.
 * @param next Express next middleware function.
 * @returns a Promise that resolves if the access token is valid, and rejects otherwise.
 */
async function validateAccess(
  keyNames: string,
  req: Request,
  res: Response,
  next: () => void
): Promise<void> {
  const accessTokens = keyNames.split(",").map((key) => get_param(req, key));
  for (const token of accessTokens) {
    const actualToken =
      token && token.startsWith("Bearer ") ? token.split(" ")[1] : token;
    const userId = actualToken ? getTokenValue(actualToken) : null;
    if (userId) {
      const user = await mongoose.model("User").findOne({ _id: userId });
      if (user) {
        req.current_user = user;
        return next();
      }
    }
  }

  response_unauthorized(res as any);
}

/**
 * Middleware to validate the presence and authenticity of an access token
 * in the request's "authorization" or "Authorization" headers.
 * 
 * @param req - The Express request object, containing the headers.
 * @param res - The Express response object, used to send a response back to the client.
 * @param next - The Express next middleware function, called if the token is valid.
 * 
 * @returns A Promise that resolves if the token is valid, allowing the request to proceed.
 * If the token is invalid, a 401 Unauthorized response is sent.
 */
const validateAuthorization = async (
  req: Request,
  res: Response,
  next: () => void
): Promise<void> => {
  await validateAccess("authorization,Authorization", req, res, next);
};

/**
 * Middleware to validate the presence and authenticity of an access token
 * in the request's "access_token" or "access-token" headers or query parameters.
 * 
 * @param req - The Express request object, containing the headers and query.
 * @param res - The Express response object, used to send a response back to the client.
 * @param next - The Express next middleware function, called if the token is valid.
 * 
 * @returns A Promise that resolves if the token is valid, allowing the request to proceed.
 * If the token is invalid, a 401 Unauthorized response is sent.
 */
const validateAccessToken = async (
  req: Request,
  res: Response,
  next: () => void
): Promise<void> => {
  await validateAccess("access_token,access-token", req, res, next);
};
/**
 * Assigns the current user to the request if the request has a valid authorization token.
 * It checks the headers, query, params, body, and cookies for the presence of the "Authorization"
 * or "authorization" key. If the key is present, it extracts the token and verifies it. If
 * the token is valid, it sets the current user of the request to the user that matches the
 * token.
 *
 * @param schema - The express-validator schema to which the custom validator will be added.
 * @returns The schema with the custom validator added.
 */
const assignAuthorization = (schema: Schema) => {
  const params_search: string[] = [
    "headers",
    "query",
    "params",
    "body",
    "cookies",
  ];
  let schema_aux: Schema = {
    authorization: {
      custom: {
        options: async (value: string, { req }: any) => {
          const key_param = params_search.find((key) => {
            if (req[key] && (req[key].authorization || req[key].Authorization)) {
              return req[key].authorization || req[key].Authorization;
            } else {
              return false;
            }
          });
          if (!key_param) {
            throw new Error("Authorization is required");
          }
          if (key_param) {
            const { authorization, Authorization } = req[key_param];
            const code_auth = authorization || Authorization;
            //value = code_auth;
            //req.body.authorization = code_auth;
            const actualToken: string =
              code_auth && code_auth.startsWith("Bearer ")
                ? code_auth.split(" ")[1]
                : code_auth;
            const userId = actualToken ? getTokenValue(actualToken) : null;
            if (!userId) {
              throw new Error("Authorization is required");
            }
            if (userId) {
              const user = await mongoose.model("User").findOne({ _id: userId });
              if (user) {
                req.current_user = user;
              }
            }
          }
        },
      },
      errorMessage: "Unauthorized",
    }
  };
  return schema_aux;
};
/**
 * Validator for checking if a field exists in a given model.
 * @param {string} model - The mongoose model to check.
 * @param {string} field - The field to check.
 * @returns {object} The validator object.
 */
const validFieldModel = (model: string, field: string) => {
  return {
    options: async (value: string) => {
      if (value) {
        const filters: Record<string, any> = {};
        filters[field] = value; 
        const user = await mongoose.model(model).findOne(filters);

        if (!user) {
          throw new Error(`${field} not valid`);
        }
      }
    },
  };
};

  /**
   * Validator for checking if a given ObjectId exists in a given model.
   * @param {string} model - The mongoose model to check.
   * @returns {object} The validator object.
   */
const validExistRegister = (model: string) => {
  return {
    options: async (value: string) => {
      if (value) {
        const record = await mongoose.model(model).findOne({ _id: value });
        if (!record) {
          throw new Error(`${model} not exists`);
        }
      }
    },
  };
}

   /**
   * Validator Generic for checking if a given ObjectId exists in a given model.
   * @param {string} model - The mongoose model to check.
   * @param {string} field - The field the model to check.
   * @param {boolean} required - The field is requerid.
   * @returns {object} The validator object.
   */

const validExistRegisterGeneric = (model: string, field: string, required: boolean) => {
  const field_id = {
    [field]: {
      [required ? 'exists' : 'optional']: true,
      isMongoId: true,
      custom: validExistRegister(model),
    }
  }
  return field_id;
}

   /**
   * Validator EmailGeneric for checking if a given Email exists in a given model.
   * @param {boolean} mustExist - The email must exist to check.
   * @param {boolean} required - The field is required to check.
   * @returns {object} The validator object.
   */

const validEmailGeneric = (mustExist: boolean, required: boolean) => {
  const emailValidation = {
    [required ? 'exists' : 'optional']: true,
    isEmail: { errorMessage: "Invalid email format" },
    custom: {
      options: async (value: string) => {
        if (mustExist) {
          return userEmailMustExist(value);
        } else {
          return userEmailMustNotExist(value);
        }
      }
    },
  };
  return emailValidation;
};

  /**
   * Validator for checking if an array of ObjectIds exists in a given model.
   * @param {string} model - The mongoose model to check.
   * @returns {object} The validator object.
   */
const validateObjectIdsExist = (model: string) => {
  return {
    options: async (value: any[]) => {
      if (!value || !Array.isArray(value)) {
        throw new Error(`The value must be an array of ObjectIds`);
      }
      console.log(value)
      const invalidIds: string[] = [];
      const notFoundIds: string[] = [];      
      value.forEach((id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          invalidIds.push(id);
        }
      });      
      if (invalidIds.length > 0) {
        throw new Error(`Invalid IDs: ${invalidIds.join(', ')}`);
      }      
      const existingDocs = await mongoose.model(model).find({
        '_id': { $in: value }
      }).select('_id');

      const existingIds = existingDocs.map(doc => doc._id.toString());      
      value.forEach((id) => {
        if (!existingIds.includes(id.toString())) {
          notFoundIds.push(id);
        }
      });      
      if (notFoundIds.length > 0) {
        throw new Error(`Non-existent IDs: ${notFoundIds.join(', ')}`);
      }
      return true; 
    }
  };
};

export {
  validateAuthorization,
  validateAccessToken,
  assignAuthorization,
  validExistRegister,
  validateObjectIdsExist,
  validFieldModel,
  validExistRegisterGeneric,
  validEmailGeneric
};
