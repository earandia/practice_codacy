import config from '../config/variables';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../interfaces';

/**
 * Generates a JSON Web Token (JWT) containing the given user ID.
 * @param {string} id - The user ID to include in the JWT.
 * @returns {string} The generated JWT.
 */
const generateToken = (id: string): string => {
    return jwt.sign(
        {
            user_id: id,
        },
        config.secret,
        {
            expiresIn: 0,
        }
    );
};

/**
 * Decodes a JSON Web Token (JWT) and extracts the user ID from its payload.
 * 
 * @param {string} token - The JWT to decode.
 * @returns {string | false} The extracted user ID if decoding is successful; otherwise, returns false.
 */
const getTokenValue = (token: string): string | false => {
    try {
        const decoded = jwt.decode(token, { complete: true }) as any as { payload: TokenPayload } as any;
        return decoded?.payload.user_id;
    } catch (error) {
        return false;
    }
};

export {
    generateToken,
    getTokenValue,
};

