import mongoose, { Document } from 'mongoose';
export interface Location {
    type: string;
    coordinates: [number | string, number | string];
}
export default interface IUser extends Document {
    name: string | null;
    user_role: string | null;
    profile_picture: string | null;
    dob: string | null;
    lastname: string | null;
    email: string;
    password: string;
    access_token: string | null;
    google_id: string | null;
    google_token: string | null;
    phone_number: string | null;
    code: string | null;
    verified_code: boolean | null;
    company_id?: mongoose.Schema.Types.ObjectId;
    categories?: mongoose.Schema.Types.ObjectId[];
    devices?: mongoose.Schema.Types.ObjectId[];
    latitude: number;
    longitude: number;
    location: Location;
    available: boolean;
}

export interface ILoginParam {
    email: string;
    password: string;
}
export interface IForgotPasswordParam {
    email: string;
}
export interface IChangeAvailableParam {
    available: string;
}
export interface IEditPasswordParam {
    old_password: string;
    new_password: string;
}
export interface ILogoutParam {
    device_token?: string;
}

export interface IAppleParam {
    apple_id: string;
    name: string;
    lastname?: string;
    email?: string;
    fullname?: string;
    password?: string;
    referral_code?: string;
    verified_email?: boolean;
}
export interface IGoogleParam {
    google_token: string;
}
export interface IUserParam {
    name: string | null;
    user_role?: string | null;
    profile_picture?: string | null;
    dob?: string | null;
    lastname?: string | null;
    email: string;
    password: string;
    access_token?: string | null;
    google_id?: string | null;
    google_token?: string | null;
    phone_number?: string | null;
    code?: string | null;
    verified_code?: boolean | null;
    company_id?: mongoose.Schema.Types.ObjectId;
    categories?: mongoose.Schema.Types.ObjectId[];
    devices?: mongoose.Schema.Types.ObjectId[];
    latitude?: number;
    longitude?: number;
    location?: any;
    available?: boolean;
}
export interface IUserEmailParam {
    email: string;
}
export interface IUserCodeParam {
    code: string;
}

export interface IUserChangeEmailParam {
    new_email: string
}