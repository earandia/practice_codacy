
import { Request, Response } from 'express';
import { Server as SocketIOServer } from "socket.io";
import { Controller } from '../../../../interfaces/controller';
import { checkSchema, matchedData, Schema, validationResult } from 'express-validator';
import models from '../../../../models';
import { controller_validation } from '../../../../utils/format';
import { formatterSchema } from '../../../../utils/params';
import config from '../../../../config/variables';
import moment from 'moment';
import logoutUserDevice from "../../../../utils/sessions";
import { ILogoutParam } from '../../../../interfaces/IUser';

/**
 * @api {post} /api/v1/logout auth/logout
 * @apiVersion 1.0.0
 * @apiName LogoutUser
 * @apiGroup Api
 *
 * @apiHeader {String} authorization API Key (access_token) generated during user login.
 *
 * @apiParam {String} [device_token] Optional device token to log out from a specific device.
 *
 * @apiSuccess {String} code Response code (success).
 * @apiSuccess {String} message Confirmation message.
 *
 * @apiExample {js} Example request:
 * POST /api/v1/logout
 * {
 *   "device_token": "device_token_value_here"
 * }
 *
 * @apiExample {js} Example response:
 * HTTP/1.1 200 OK
 * {
 *   "code": "success",
 *   "message": "User logged out successfully"
 * }
 */

const schema: Schema = {
  device_token: {
    optional: true,
    isString: { errorMessage: "device_token must be a string" },
    trim: true
  }
}

const subSchema = formatterSchema(
  schema,
  {
    authorization: true,
  }
);

export default {
  method: 'post',
  url: 'logout',
  validator: [
    [checkSchema(subSchema)]
  ],
  controller: async (req: Request, res: Response, io:SocketIOServer) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return controller_validation(res, errors);
    } else {
      const parameters = matchedData<ILogoutParam>(req);
      if (parameters.device_token) {
        await logoutUserDevice((req as any)?.current_user._id, parameters.device_token);
      }
      let user = (req as any)?.current_user;
      if (user.user_role === 'guard') {
        await models.User.updateOne({ _id: user._id }, { logout_time: moment() });
      }
      return res.json({
        code: config.codes.success,
        message: 'User logged out successfully'
      });
    }
  },
} as Controller;
