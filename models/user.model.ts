import mongoose, { Query } from "mongoose";
import config from "../config/variables";
import IUser from "../interfaces/IUser";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import moment from "moment";
import { mongoosePagination, Pagination } from "mongoose-paginate-ts";

const PROTECTED_ATTRIBUTES = [
  "password",
  "createdAt",
  "updatedAt",
  "__v",
  "_id",
];
const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, default: null },
    user_role: { type: String, default: null },
    dob: { type: String, default: null },
    lastname: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_number: { type: String, default: null }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, attributes) {
        attributes.id = attributes._id;
        attributes.created_at = attributes.createdAt;
        attributes.dob = moment(attributes.dob, "DD/MM/YYYY").format(
          "YYYY-MM-DD"
        );

        for (let a of PROTECTED_ATTRIBUTES) {
          delete attributes[a];
        }
        return attributes;
      },
    },
  }
);

userSchema.pre<IUser & Document>("save", async function (next) {
  const self = this as IUser & Document;

  self.access_token = generateToken(self._id as any);

  if (self.isModified("password") && self.password) {
    self.password = await bcrypt.hash(self.password, config.salt);
  }

  if (self.isModified("email") && self.email) {
    self.email = self.email.toLowerCase();
  }
  next();
});
userSchema.pre<Query<IUser, Document>>("updateOne", async function (next) {
  const updateData = this.getUpdate() as Partial<IUser>;
  const existingRecord = await this.model.findOne(this.getQuery());

  if (updateData) {
    if (updateData.email) {
      updateData.email = updateData.email.toLowerCase();
    }    
  }

  next();
});
userSchema.plugin(mongoosePagination);
const UserModel: Pagination<IUser> = mongoose.model<IUser, Pagination<IUser>>(
  "User",
  userSchema,
  "users"
);

export default UserModel;
export const modelName = UserModel.modelName;
