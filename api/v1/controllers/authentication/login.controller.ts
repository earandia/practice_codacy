
import { Request, Response } from 'express';
import { Server as SocketIOServer } from "socket.io";
import { Controller } from '../../../../interfaces/controller';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import models from '../../../../models';
import { controller_validation, response_error } from '../../../../utils/format';
import { formatterSchema } from '../../../../utils/params';
import bcrypt from 'bcrypt';
import { generateToken } from '../../../../utils/jwt';
import { ILoginSchema } from '../../../../schemas/UserSchema';
import { ILoginParam } from '../../../../interfaces/IUser';

/**
 * @api {post} /api/v1/login auth/login
 * @apiVersion 1.0.0
 * @apiName Login
 * @apiGroup Api
 *
 * @apiParam {String} email Correo electrónico del usuario registrado.
 * @apiParam {String} password Contraseña del usuario (si el usuario tiene una contraseña registrada).
 *
 * @apiHeader {String} Authorization Token de acceso generado en el login del usuario (si es necesario).
 *
 * @apiSuccess {String} _id ID único del usuario.
 * @apiSuccess {String} email Correo electrónico del usuario.
 * @apiSuccess {String} name Nombre del usuario.
 * @apiSuccess {String} role Rol del usuario (por ejemplo: "customer", "partner").
 * @apiSuccess {String} access_token Token de acceso (JWT) que se utiliza para autenticar las futuras solicitudes.
 *
 * @apiError (401) Unauthorized Credenciales incorrectas. El email o la contraseña no coinciden.
 * @apiError (404) NotFound No se encontró un usuario con el correo electrónico proporcionado.
 * @apiError (400) BadRequest El correo electrónico fue registrado de una forma diferente o no existe.
 * @apiError (500) InternalServerError Error en el servidor al procesar la solicitud.
 *
 * @apiExample {json} Ejemplo de Solicitud:
 *     POST /api/v1/login
 *     {
 *       "email": "usuario@dominio.com",
 *       "password": "contraseña123"
 *     }
 *
 * @apiExample {json} Ejemplo de Respuesta Exitosa:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "5f4e1b2b7f1f542fbf6e93f8",
 *       "email": "usuario@dominio.com",
 *       "name": "Juan Pérez",
 *       "role": "customer",
 *       "access_token": "jwt_token_generado"
 *     }
 *
 * @apiExample {json} Ejemplo de Respuesta de Error (Wrong credentials):
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Wrong credentials"
 *     }
 *
 * @apiExample {json} Ejemplo de Respuesta de Error (Correo registrado de otra forma):
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "El email fue registrado de otra forma, intente con otra opción."
 *     }
 */

/**
 * Defines the validation schema for login using `express-validator`.
 * The schema `ILoginSchema` contains details about the validation rules
 * for the login parameters (email and password).
 */
const subSchema = formatterSchema(
  ILoginSchema,
  {
    authorization: false,
  }
);

export default {
  method: 'post',
  url: 'login',
  validator: [
    [checkSchema(subSchema)]
  ],
  controller: async (req: Request, res: Response, io: SocketIOServer) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return controller_validation(res, errors);
    } else {

      const parameters = matchedData<ILoginParam>(req);

      let user = await models.User.findOne({ email: parameters.email ,role: { $ne: "admin" }});
      if (user) {
        if (user.password && await bcrypt.compare(parameters.password as string, user.password)) {
          user.access_token = generateToken(user._id);
          return res.json(user);
        } else {
          let error = user.password ? 'Wrong credentials' : 'El email fue registrado de otra forma, intente con otra opción.'
          return response_error(res, error);
        }
      } else {
        return response_error(res, "Wrong credentials");
      }
    }
  },
} as Controller;
