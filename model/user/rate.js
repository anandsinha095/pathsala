import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
let rate = Schema({
    item: { type: Number, required: true },
    customerId: { type: Schema.Types.ObjectId, trim: true },
    productId:{ type: Schema.Types.ObjectId, trim: true },
    subItem: { type: String, trim: true },
    sizeDetails: [
        { size:String, labourCost:Number}],
    updtaedBy: { type: String, trim:true },
    createdBy: { type: String, trim:true },
}, { timestamps: true })
//User.plugin(mongoosePaginate);
export default model('rate', rate, 'rate');
