import dotenv from 'dotenv';
dotenv.config({ path: process.env.NODE_ENV === 'production' ? 'dist/.env.production' : 'dist/.env.staging' });
// import admin from "firebase-admin";
// admin.initializeApp({
//   credential: admin.credential.cert(__dirname + "/credentials.json"),
// });
const config: any = {
    port: process.env.PORT || 3000,
    secret: "asdkasjdkasdhkjasdqwekjqweqwoqwepoadaklsd",
    salt: 10,
    host_url: process.env.HOST_URL,
    api_url: process.env.API_URL,
    codes: {
      success: "SUCCESS",
      error: "ERROR",
      not_registered: "NOT_REGISTERED",
      unauthorized: "UNAUTHORIZED",
    },
    key_stripe: process.env.KEY_STRIPE,
    mail:{
      email_send : process.env.NODEMAIL_EMAIL || '',
      user_send : process.env.NODEMAIL_USERNAME || '',
      pass_send : process.env.NODEMAIL_PASSWORD || '',
    },
    time_offset: {
      argentina: -3,
      utc: 0,
      bolivia: -4
    },
  };
  
export default config;
  