import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
let classes = Schema({
    classId:{ type: String, trim: true },
    name: { type: String, trim: true },
    steats: { type: Number, trim: true },
    subject: [{ subjectName:String, status:Boolean}],
    createdBy: { type: Schema.Types.ObjectId, trim: true },
    updatedBy: { type: Schema.Types.ObjectId, trim: true },
    status: { type: Boolean, default: true },
}, { timestamps: true })
//User.plugin(mongoosePaginate);
export default model('classes', classes, 'classes');

