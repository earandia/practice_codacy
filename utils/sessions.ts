import models from '../models';

type LogoutUserDeviceParams = {
    user_id?: string;
    device_token?: string;
};

/**
 * Closes the session for a user device and updates the user's devices array.
 * @param {string} user_id - The user id.
 * @param {string} device_token - The device token.
 * @returns {Promise<void>}
 */
const logoutUserDevice = async (user_id: LogoutUserDeviceParams, device_token: string): Promise<void> => {
    const filters: { device_token?: string; user_id?: string } = {
        device_token,
        ...(user_id ? { user_id } : {}),
    } as LogoutUserDeviceParams;

    try {
        await models.Device.deleteMany(filters);

        if (user_id) {
            const devices = await models.Device.find({ user_id });
            await models.User.updateOne({ _id: user_id }, { devices });
        }
    } catch (error) {
        console.error("Error al cerrar sesión del dispositivo:", error);
    }
};

export default logoutUserDevice;
