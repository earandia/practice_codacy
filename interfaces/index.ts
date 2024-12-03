import mongoose from "mongoose";

//FORMAT RESPONSE
export interface ErrorDetail {
    param?: string;
    type?: string;
    value?: string;
    msg?: string;
    path?: string;
    location?: string;
  }
  
export interface Errors {
    errors?: ErrorDetail[];
  }

export  interface TokenPayload {
    user_id: mongoose.Schema.Types.ObjectId; 
}

export interface StripeParameters {
  stripe_payouts_enabled?: boolean;
  stripe_charges_enabled?: boolean;
}
export interface IUserIdParam{
  user_id: mongoose.Schema.Types.ObjectId;
};

export interface IPaginationParam{
  page?: number;
  limit?: number;
  keyword?: string;
};
