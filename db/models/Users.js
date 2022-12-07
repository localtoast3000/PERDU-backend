import mongoose from 'mongoose';
import uid2 from 'uid2';

export default mongoose.model(
  'users',
  mongoose.Schema({
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    password: String,
    allowDataShare: Boolean,
    userItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'items' }],
    token: { type: String, default: () => uid2(32) },
    created: { type: Date, default: Date.now },
  })
);
