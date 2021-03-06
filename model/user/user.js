import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
let users = Schema({
    userId:{ type: String, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true, unique: true, required: 'Email address is required'},
    password: { type: String, required: 'Password is required.', trim: true },
    gender: { type: Boolean, trim: true },
    dob: { type: Date, trim: true },
    organization: {type: String, trim: true},
    phoneNumber: { type: Number, trim: true },
    addressOne: { type: String, trim: true },
    addressTwo: { type: String, trim: true },
    country: { type: String, trim: true },
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    zipcode: { type: String, trim: true },
    roleId: { type: String, trim: true },
    validateToken: { type: String, trim: true },
    status: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    profilePicture:{type: String, trim:true},
}, { timestamps: true })
//User.plugin(mongoosePaginate);
export default model('users', users, 'users');

