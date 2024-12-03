/**
 * Generates a random password of the given length, or 8 characters by default, using the given charset.
 * If the length is less than or equal to 0, it throws an error.
 * @param length The length of the password to generate. Defaults to 8.
 * @param charset The string of characters to use when generating the password. Defaults to "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".
 * @returns A randomly generated password.
 */
const generate_password = (length: number = 8, charset: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"): string => {
    if (length <= 0) throw new Error("Password length must be a positive number");

    let result = "";
    const charsetLength = charset.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charsetLength);
        result += charset.charAt(randomIndex);
    }

    return result;
};
/**
 * Generates a random code of the given length, or 8 characters by default, using the given charset.
 * If the length is less than or equal to 0, it throws an error.
 * @param length The length of the code to generate. Defaults to 8.
 * @returns A randomly generated code.
 */
export const generate_code = (length: number = 8): string => {
    const charset = "0123456789";
    let retVal = "";

    for (let i = 0; i < length; ++i) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        retVal += charset.charAt(randomIndex);
    }

    return retVal;
};


export default generate_password;
