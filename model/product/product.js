import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
let product = Schema({ 
    countId:{ type: String, trim: true },   
    categoryId:{ type: Schema.Types.ObjectId, trim: true },
    title: { type: String, trim: true },
    price: { type: Number, trim: true },
    discount: { type: Number, trim: true},
    discountStartDate: { type: Date, trim: true },
    discountEndDate: { type: Date, trim: true },    
    availableStock: { type: Number, trim: true },
    returnAllowed: { type: Boolean, default: false },
    cancelattionAllowed: { type: Boolean, default: false },
    planDelivery: { type: Boolean, trim: true },
    productDescription: { type: String, trim: true },
    productImage: {type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, trim: true },
    updatedBy: { type: Schema.Types.ObjectId, trim: true },
    approvedBy: { type: Schema.Types.ObjectId, trim: true },
    featured: { type: Boolean, default: false },
    newArrival:{type: Boolean, default: false},
    status: { type: Boolean, default: true },
    isActive:{ type: Boolean, default: false },
    softDelete: { type: Boolean, default: false },
}, { timestamps: true })
//User.plugin(mongoosePaginate);
export default model('product', product, 'product');
