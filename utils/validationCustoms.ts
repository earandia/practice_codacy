import mongoose from "mongoose";
import { get_param } from "./params";
import { RequestParams } from "../types";
import bcrypt from 'bcrypt';
/**
 * Validates that the given email is unique within the User collection.
 * It checks for existing users with a similar email, ignoring case.
 * If a current user ID or parameter ID is provided, it excludes that
 * user from the uniqueness check.
 *
 * @param value - The email address to be validated for uniqueness.
 * @param req - The request object containing the current user information.
 * @throws Will reject the promise if the email is already in use.
 */
const validateUniqueEmail = async (value: string, { req }: { req: Request }) => {
  if (value) {
    const filters: any = { email: { $regex: value, $options: "i" } };
    let currentUserId = null
    try {
      currentUserId = (req as any) ? (req as any)?.current_user?._id : null;
    } catch (error) {
      console.log(error);
    }
    const paramId = get_param(req as RequestParams, "id");

    if (currentUserId || paramId) {
      filters._id = {
        $ne: paramId ? paramId : currentUserId,
      };
    }
    const user = await mongoose.model("User").findOne(filters);
    if (user) {
      await Promise.reject("Email already in use");
    }
    
  }
};
/**
 * Validates that the given email is unique within the User collection.
 * It checks for existing users with a similar email, ignoring case.
 *
 * @param value - The email address to be validated for uniqueness.
 * @param req - The request object containing the current user information.
 * @throws Will reject the promise if the email is already in use.
 */
const validateUniqueEmailCreate = async (value: string, { req }: { req: Request }) => {
  if (value) {
    const filters: any = { email: { $regex: value, $options: "i" } };
    const user = await mongoose.model("User").findOne(filters);
    if (user) {
      await Promise.reject("Email already in use");
    }
  }
};
/**
 * Validates that a given email is associated with a registered user.
 *
 * @param value - The email to be validated for existence.
 * @throws Will reject the promise if the email is not registered.
 */
const userEmailMustExist = async (value: string) => {
  if (!(await mongoose.model("User").findOne({ email: value }))) {
    return Promise.reject("Email is not registered.");
  }
};

const userEmailMustNotExist = async (value: string) => {
  if (await mongoose.model("User").findOne({ email: value })) {
    return Promise.reject("Email already in use.");
  }
};

/**
 * Validates that the given user_id is associated with a registered user.
 *
 * @param value - The user_id to be validated for existence.
 * @throws Will reject the promise if the user_id is not registered.
 */
const userMustExist = async (value: string) => {
  if (
    value !== undefined &&
    !(await mongoose.model("User").findOne({ _id: value }))
  ) {
    return Promise.reject("user_id not exists");
  }
}
/**
 * Validates that a given sender_user_id is associated with a registered user.
 *
 * @param value - The sender_user_id to be validated for existence.
 * @throws Will reject the promise if the sender_user_id is not registered.
 */
const senderMustExist = async (value: string) => {
  if (
    value !== undefined &&
    !(await mongoose.model("User").findOne({ _id: value }))
  ) {
    return Promise.reject("sender_user_id not exists");
  }
}

  /**
   * Validates that the given password is the same as the current user's password.
   * It gets the current user from the request and uses bcrypt to compare the given
   * password with the current user's password. If the password is invalid, it will
   * return a rejected promise with the message "password invalid". If the current user
   * is not authorized (i.e. not logged in), it will also return a rejected promise with
   * the message "User Not authorized".
   * @param value - The password to be validated.
   * @param req - The request object containing the current user information.
   * @throws Will reject the promise if the password is invalid.
   */
const validateUserPasswordCurrent = async (value: string, { req }: { req: Request }) => {
  const user = (req as any)?.current_user;
  if (user) {
    let confirmed_password = await bcrypt.compare(
      value.toString(),
      user.password.toString()
    );
    if (confirmed_password == false)
      return Promise.reject("password invalid");
  } else {
    return Promise.reject("User Not authorized");
  }
}
  /**
   * Validates that the given user_conversation_id is associated with a registered conversation.
   *
   * @param value - The user_conversation_id to be validated for existence.
   * @param req - The request object containing the current user information.
   * @throws Will reject the promise if the user_conversation_id is not registered.
   */
const userConversationMustExist = async (value: string, { req }: { req: Request }) => {
  if (!(await mongoose.model("Conversation").findOne({ _id: value }))) {
    return Promise.reject("user_conversation_id not exists");
  }
}
export {
  validateUniqueEmailCreate,
  validateUniqueEmail,
  userEmailMustNotExist,
  userEmailMustExist,
  userMustExist,
  validateUserPasswordCurrent,
  userConversationMustExist,
  senderMustExist
};