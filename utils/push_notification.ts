import mongoose, { Document, Types } from "mongoose";
import config from "./../config/variables";

interface Payload {
    notification: {
        title: string;
        body: string;
    };
    data?: Record<string, any>;
}

interface DeviceDocument extends Document {
    device_token: string;
    user_id: Types.ObjectId;
}

interface NotificationData {
    title: string;
    body: string;
    user_id: Types.ObjectId | string;
    metadata: Record<string, any>;
    type?: string;
}

interface EmailData {
    subject: string | null;
    title: string;
    body: string;
    footer: string | null;
}

/**
 * Sends push notifications to the specified user's devices.
 *
 * @param {Payload} payload - The notification data, including title and body.
 * @param {Types.ObjectId | string | Array<Types.ObjectId | string>} user_id - 
 *        The user ID(s) for which to send the notifications. Can be a single 
 *        user ID or an array of user IDs.
 * @returns {Promise<Array<Promise<string | undefined>>>} - An array of promises, 
 *          each resolving to a response from the messaging service, or undefined 
 *          if the device token is not available.
 */
const sendPushNotification = async (payload: Payload, user_id: Types.ObjectId | string | Array<Types.ObjectId | string>) => {
    let devices: DeviceDocument[] = [];

    if (Array.isArray(user_id)) {
        for (const userId of user_id) {
            const device = await mongoose
                .model<DeviceDocument>("Device")
                .find({ user_id: userId })
                .sort({ _id: -1 })
                .limit(1)
                .select("device_token");
            if (device && device.length > 0) {
                devices.push(device[0]);
            }
        }
    }

    if (user_id && !Array.isArray(user_id) && mongoose.Types.ObjectId.isValid(user_id.toString())) {
        devices = await mongoose
            .model<DeviceDocument>("Device")
            .find({ user_id })
            .sort({ _id: -1 })
            .limit(1)
            .select("device_token");
    }

    return devices.map((device) => {
        if (device.device_token) {
            const message = {
                ...payload,
                apns: {
                    payload: {
                        aps: {
                            "content-available": 1,
                        },
                    },
                },
                token: device.device_token,
            };
            return config.admin
                .messaging()
                .send(message)
                .then((response: any) => response)
                .catch((error: any) => console.error("Error sending message:", error));
        }
        return undefined;
    });
};

/**
 * Save the notification on the Notification table
 * @param {Object} param0 - Contains the notification title, description, and metadata
 * @param {string | ObjectId | Array<string | ObjectId>} param0.users - The user or list of users to save the notification for
 * @param {Object} [param0.data] - The metadata to save with the notification
 * @returns {Promise<void>}
 */
const saveOnTableNotification = async (
    { notification, data }: { notification: Payload["notification"]; data: Record<string, any> },
    users: Types.ObjectId | string | Array<Types.ObjectId | string>
) => {
    const lowercaseKeys = (obj: Record<string, any>) => {
        return Object.keys(obj).reduce((acc, key) => {
            acc[key.toLowerCase()] = obj[key];
            return acc;
        }, {} as Record<string, any>);
    };

    if (Array.isArray(users)) {
        const data_notification = users.map((user_id) => ({
            title: notification.title,
            description: notification.body,
            user_id,
            metadata: data,
            type: data.type || "",
            ...lowercaseKeys(data),
        }));
        await mongoose.model("Notification").insertMany(data_notification);
    } else {
        const data_notification = {
            title: notification.title,
            description: notification.body,
            user_id: users,
            metadata: data,
            type: data.type || "",
            ...lowercaseKeys(data),
        };
        await mongoose.model("Notification").create(data_notification);
    }
};

/**
 * Creates and saves a batch of push notifications and optionally associated email data.
 *
 * @param {Payload} payload - The notification data containing the title and body.
 * @param {Types.ObjectId | string | Array<Types.ObjectId | string>} user_id - The user ID(s) for which to create the notifications. Can be a single user ID or an array of user IDs.
 * @param {EmailData | null} [payload_email=null] - Optional email data to send with the notification.
 * @param {boolean} [send_email=false] - Flag to indicate whether to send an email along with the push notification.
 * @returns {Promise<any>} - A promise that resolves when the batch push notification(s) are created and saved.
 */
const createBatchOfPush = async (
    payload: Payload,
    user_id: Types.ObjectId | string | Array<Types.ObjectId | string>,
    payload_email: EmailData | null = null,
    send_email = false
) => {
    const emailData = payload_email || {
        subject: null,
        title: payload.notification.title,
        body: payload.notification.body,
        footer: null,
    };

    if (Array.isArray(user_id)) {
        const data_batch_push = user_id.map((userId) => ({
            payload,
            user_id: userId,
            payload_email: emailData,
            send_email,
        }));
        return await mongoose.model("BatchPush").insertMany(data_batch_push);
    }

    if (user_id && !Array.isArray(user_id) && mongoose.Types.ObjectId.isValid(user_id.toString())) {
        return await mongoose.model("BatchPush").create({
            payload,
            user_id,
            payload_email: emailData,
        });
    }
};

export { sendPushNotification, saveOnTableNotification, createBatchOfPush };
