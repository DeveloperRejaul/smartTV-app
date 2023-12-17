import { Schema, model, } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const schema = new Schema({
  org:{type:Schema.Types.ObjectId, ref: 'Organization'},
  avatar:{type:String},
  name:{type:String},
  email: { type: String, required: true,unique:true },
  password: { type: String, required: true },
  address: { type: String },
  userType: { type: String,required: true ,  enum: ['supper-admin', 'masjid-owner', 'admin', 'user'] , default:'user'},
}, { timestamps: true });

schema.plugin(paginate);
export default model('User', schema);




