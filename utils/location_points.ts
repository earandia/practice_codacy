type ValidationValue = string | number | undefined;

/**
 * Validate a latitude value.
 *
 * @param {string|number|undefined} value Latitude value to validate.
 *
 * @throws {Error} If the value is not a valid latitude.
 *
 * @returns {Promise<void>} Resolves if the value is valid.
 */
const validateLatitude = async (value: ValidationValue): Promise<void> => {
    if (value !== undefined) {
        const latitude = parseFloat(value as string);
        if (isNaN(latitude) || latitude < -90 || latitude > 90) {
            throw new Error("Invalid latitude value");
        }
    }
};



/**
 * Validate a longitude value.
 *
 * @param {string|number|undefined} value Longitude value to validate.
 *
 * @throws {Error} If the value is not a valid longitude.
 *
 * @returns {Promise<void>} Resolves if the value is valid.
 */
const validateLongitude = async (value: ValidationValue): Promise<void> => {
    if (value !== undefined) {
        const longitude = parseFloat(value as string);
        if (isNaN(longitude) || longitude < -180 || longitude > 180) {
            throw new Error("Invalid longitude value");
        }
    }
};

/**
 * Validate a radius value.
 *
 * @param {string|number|undefined} value Radius value to validate.
 *
 * @throws {Error} If the value is not a valid radius.
 *
 * @returns {Promise<void>} Resolves if the value is valid.
 */
const validateRadius = async (value: ValidationValue): Promise<void> => {
    if (value !== undefined) {
        const radius = parseFloat(value as string);
        if (isNaN(radius) || radius <= 0) {
            throw new Error("Invalid radius value");
        }
    }
};

export {
    validateLatitude,
    validateLongitude,
    validateRadius
};
