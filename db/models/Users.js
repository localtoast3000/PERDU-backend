import mongoose from 'mongoose';

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
    token: String,
    created: { type: Date, default: Date.now },
  })
);
