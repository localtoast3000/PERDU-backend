import mongoose from 'mongoose';

export default mongoose.model(
  'items',
  mongoose.Schema({
    category: String,
    details: Object,
    address: String,
    authentication: Object,
    isFound: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    declared: Date,
  })
);
