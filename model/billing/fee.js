import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
let classes = Schema({
    invoiceId:{ type: String, trim: true },
    registration: { type: Number, trim: true },
    security: { type: Number, trim: true },
    admission:{type: Number, trim: true},
    annual: { type: Number, trim: true },
    exam: { type: Number, trim: true},
    tuition: { type: Number, trim: true},
    computer: { type: Number, trim: true},
    transport: { type: Number, trim: true},
    dance: { type: Number, trim: true},
    miscellaneous: { type: Number, trim: true},
    extraActivityClasses: {type: Number, trim: true},
    arrears: { type: Number, trim: true},
    fine: { type: Number, trim: true},
    paymentMode:{type:String, default:"CASH"},
    paymentStatus:{type:String, default:"PAID",enum:['PAID']},
    status: { type: Boolean, default: true },
}, { timestamps: true })
//User.plugin(mongoosePaginate);
export default model('classes', classes, 'classes');

