
import { Schema } from "express-validator";
import { userEmailMustExist, validateUniqueEmail } from "../utils/validationCustoms";
import models from "../models";
import mongoose from "mongoose";
// import { fileSanitizer } from "../utils/upload";
import { validateObjectIdsExist, validEmailGeneric, validExistRegister } from "../utils/validators";
const user_role = ['customer','partner','user']

export const IUserIdSchema: Schema = {
  user_id: {
    exists: true,
    isMongoId: true,
    custom: validExistRegister('User'),
  },
};

export const IUserSchema: Schema = {
  name: {
    optional: { options: { nullable: true } },
    isString: { errorMessage: "Name must be a string" },
  },
  user_role: {
    optional:true,
    isString:true,
    isIn: {
      options: [...user_role],
      errorMessage: "User role must be 'customer' or 'partner'",
    },
  },
  dob: {
    optional: { options: { nullable: true } }
  },
  lastname: {
    optional: { options: { nullable: true } },
    isString: { errorMessage: "Last name must be a string" },
  },
  email: {
    isEmail: { errorMessage: "Email must be a valid email address" }, 
    custom: {
      options: async (value: string, { req }) => validateUniqueEmail(value, { req } as any)
    },
  },
  password: {
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
  },
  access_token: {
    optional: { options: { nullable: true } },
    isString: { errorMessage: "Access token must be a string" },
  },
  google_id: {
    optional: { options: { nullable: true } },
    isString: { errorMessage: "Google ID must be a string" },
  },
  google_token: {
    optional: { options: { nullable: true } },
    isString: { errorMessage: "Google token must be a string" },
  },
  phone_number: {
    optional: { options: { nullable: true } },
    isString: { errorMessage: "Phone number must be a string" },
  },
  code: {
    optional: { options: { nullable: true } },
    isString: { errorMessage: "Code must be a string" },
  },
  verified_code: {
    optional: { options: { nullable: true } },
    isString: { errorMessage: "Verified code must be a string" },
  },
  company_id: {
    isMongoId:true,
    custom:validExistRegister('Company'),
    optional: true,
  },
  categories: {
    isArray: { errorMessage: "Categories must be an array of ObjectIds" },
    custom:validateObjectIdsExist('Category'),
    optional: true,
  },
  devices: {
    optional: true,
    isArray: { errorMessage: "Devices must be an array of ObjectIds" },
    custom: {
      options: (value: any[]) => value.every((id) => mongoose.Types.ObjectId.isValid(id)),
      errorMessage: "Each device ID must be a valid ObjectId",
    },
  },
  latitude: {
    optional: true,
    isFloat: { options: { min: -90, max: 90 }, errorMessage: "Latitude must be between -90 and 90" },
    toFloat: true,
  },
  longitude: {
    optional: true,
    isFloat: { options: { min: -180, max: 180 }, errorMessage: "Longitude must be between -180 and 180" },
    toFloat: true,
  },
  location: {
    optional: true,
    isObject: { errorMessage: "Location must be an object" },
  },
  available: {
    optional: true,
    isBoolean: { errorMessage: "Available must be a boolean" },
    toBoolean: true,
  },
};
export const IUserFarvSchema: Schema = {
  name: {
    optional: { options: { nullable: true } },
    isString: { errorMessage: "Name must be a string" },
  },
  lastname: {
    optional: { options: { nullable: true } },
    isString: { errorMessage: "Last name must be a string" },
  },
  phone_number: {
    optional: { options: { nullable: true } },
    isString: { errorMessage: "Phone number must be a string" },
  },
  dob: {
    optional: { options: { nullable: true } }
  },
  categories: {
    isArray: { errorMessage: "Categories must be an array of ObjectIds" },
    custom:validateObjectIdsExist('Category'),
    optional: true,
  },
  latitude: {
    optional: true,
    isFloat: { options: { min: -90, max: 90 }, errorMessage: "Latitude must be between -90 and 90" },
    toFloat: true,
  },
  longitude: {
    optional: true,
    isFloat: { options: { min: -180, max: 180 }, errorMessage: "Longitude must be between -180 and 180" },
    toFloat: true,
  }
};
export const ILoginSchema: Schema = {
  email: validEmailGeneric(true,true),
  password: {
    isLength: {
      options: { min: 8 },
      errorMessage: 'Password should be at least 8 chars',
    },
  }
};

export const IForgotPasswordSchema: Schema = {
  email: {
    isEmail: { errorMessage: "Invalid email format" },
    custom: {
      options: async (value: string) => userEmailMustExist(value)
    },
  }
};

export const IPaginationSchema: Schema = {
  page: {
    optional: true,
    isInt: { options: { min: 1 }, errorMessage: "Page must be a positive integer" },
    toInt: true,
  },
  limit: {
    optional: true,
    isInt: { options: { min: 1 }, errorMessage: "Limit must be a positive integer" },
    toInt: true,
  },
  keyword: {
    optional: true,
    isString: { errorMessage: "Keyword must be a string" },
    trim: true,
  },
};

export const IUserEmailSchema:Schema ={
  email: {
    exists: true,
    isEmail: { errorMessage: "Invalid email format" },
    normalizeEmail: true,
    custom: {
      options: async (email: string, { req }) => {
        if (!await models.User.findOne({ email })) return Promise.reject('Email is Invalid')
      },
    },
  },
}