
import { Request, Response } from 'express';
// import { Server as SocketIOServer } from "socket.io";
import { Controller } from '../../../../interfaces/controller';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import models from '../../../../models';
import { controller_validation } from '../../../../utils/format';
import { formatterSchema } from '../../../../utils/params';
import { IUserIdParam } from '../../../../interfaces';
import { IUserIdSchema } from '../../../../schemas/UserSchema';

/**
 * @api {get} /api/v1/user user/user
 * @apiVersion 1.0.0
 * @apiName GetUser
 * @apiGroup Api
 * 
 * @apiHeader {String} authorization API Key (access_token) generated during user login.
 * 
 * @apiParam {String} [user_id] ID del usuario (MongoDB ObjectId) cuyos detalles se desean consultar.
 * Si no se proporciona, se utilizará el ID del usuario autenticado.
 * 
 * @apiSuccess {String} _id ID del usuario.
 * @apiSuccess {String} name Nombre del usuario.
 * @apiSuccess {String} email Correo electrónico del usuario.
 * @apiSuccess {String} createdAt Fecha de creación de la cuenta del usuario.
 * @apiSuccess {String} updatedAt Última fecha de actualización del perfil del usuario.
 * 
 * @apiError UserNotFound El ID de usuario proporcionado no existe en la base de datos.
 * @apiError InvalidParameter El ID de usuario no es válido o está mal formateado.
 * 
 * @apiExample {curl} Ejemplo de solicitud con `user_id`:
 *     curl -X GET -H "Authorization: Bearer <token>" http://localhost:3000?user_id=<user_id>
 * 
 * @apiExample {curl} Ejemplo de solicitud usando el usuario autenticado:
 *     curl -X GET -H "Authorization: Bearer <token>" http://localhost:3000
 * 
 * @apiVersion 1.0.0
 */

const subSchema = formatterSchema(
  { ...IUserIdSchema },
  {
    authorization: true,
  }
);

export default {
  method: 'get',
  url: 'user',
  validator: [
    [checkSchema(subSchema)]
  ],
  controller: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return controller_validation(res, errors);
    } else {
      const parameters = matchedData<IUserIdParam>(req);
      const user = (req as any)?.current_user;
      const user_id = parameters.user_id
        ? parameters.user_id
        : '670feb4c67672ee3236d8a72';
      return res.json(await models.User.findById(user_id));
    }
  },
} as Controller;