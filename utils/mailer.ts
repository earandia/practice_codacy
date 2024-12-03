// import nodemailer, { Transporter, SendMailOptions, SentMessageInfo } from 'nodemailer';
// import path from 'path';
// import fs from 'fs';
// import config from '../config/variables';
// const emailSend = config.mail.email_send;
// const userSend = config.mail.user_send;
// const passSend = config.mail.pass_send;

// interface MailParams {
//     to: string;
//     subject: string;
//     body: string;
//     files?: Array<{ content: string }>;
// }

// interface EmailResponse {
//     code: number;
//     message: SentMessageInfo | string;
// }

// /**
//  * Creates a nodemailer transporter using the email credentials from
//  * the environment variables.
//  *
//  * @returns {Transporter} - The transporter to use.
//  */
// const createTransporter = (): Transporter => {
//     return nodemailer.createTransport({
//         host: "mail.smtp2go.com",
//         port: 2525,
//         auth: {
//             user: userSend,
//             pass: passSend
//         }
//     });
// };

// /**
//  * Creates the mail options from a MailParams object.
//  *
//  * @param {MailParams} params - The mail parameters.
//  *
//  * @returns {SendMailOptions} - The mail options.
//  */
// const createMailOptions = (params: MailParams): SendMailOptions => {
//     const mailOptions: SendMailOptions = {
//         from: `FAVR <${emailSend}>`,
//         to: params.to,
//         subject: params.subject,
//         html: params.body,
//     };

//     if (params.files) {
//         mailOptions.attachments = parsePathTemporalFiles(params.files);
//     }

//     return mailOptions;
// };

// /**
//  * Sends an email using the provided mail options.
//  *
//  * @param {SendMailOptions} mailOptions - The mail options including recipient, subject, and body.
//  *
//  * @returns {Promise<EmailResponse>} - A promise that resolves to an EmailResponse indicating
//  * the status code and the message information or error.
//  */
// /******  e85090a5-6ae0-43af-a173-6ea98b90835e  *******/ 
// const sendMail = async (mailOptions: SendMailOptions): Promise<EmailResponse> => {
//     const transporter = createTransporter();

//     try {
//         const info = await transporter.sendMail(mailOptions);
//         return { code: 200, message: info };
//     } catch (err) {
//         return { code: 500, message: (err as Error).message };
//     }
// };

// /**
//  * Sends an email with the specified parameters using the configured mail transporter.
//  *
//  * @param {MailParams} params - The parameters for sending the email, including recipient, subject, body, and optional attachments.
//  *
//  * @returns {Promise<EmailResponse>} - A promise that resolves to an EmailResponse indicating the result of the email sending operation.
//  */
// const mailer = async (params: MailParams): Promise<EmailResponse> => {
//     const mailOptions = createMailOptions(params);
//     return await sendMail(mailOptions);
// };

// /**
//  * Sends a forgot password email to the specified email address with the provided new password.
//  *
//  * @param {string} email - The recipient's email address where the forgotten password email will be sent.
//  * @param {string} password - The new password to be included in the email body.
//  *
//  * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the email was successfully sent.
//  */
// const sendEmailForgotPassword = async (email: string, password: string): Promise<boolean> => {
//     const options: MailParams = {
//         to: email,
//         subject: 'New Password',
//         body: `This is your new password: ${password}`,
//     };

//     const sendEmailResponse = await mailer(options);
//     return sendEmailResponse.code === 200;
// };

// /**
//  * Converts an array of file objects with content string to an array of file objects with content ReadStream.
//  * The content string is assumed to be a file path relative to the public folder.
//  * If the file does not exist at the given path, an empty array is returned.
//  * @param {Array<{content: string}>} files - An array of file objects with content string.
//  * @returns {Array<{content: fs.ReadStream}>} - An array of file objects with content ReadStream.
//  */
// const parsePathTemporalFiles = (files: Array<{ content: string }>): Array<{ content: fs.ReadStream }> => {
//     const savePath = '../public/';
//     const parseList: Array<{ content: fs.ReadStream }> = [];

//     for (const file of files) {
//         const filePath = path.join(__dirname, savePath, file.content);
//         if (fs.existsSync(filePath)) {
//             file.content = fs.createReadStream(filePath) as any;
//             parseList.push(file as any);
//         } else {
//             console.log('Files invalid');
//             return [];
//         }
//     }

//     return parseList;
// };

// export default mailer;
