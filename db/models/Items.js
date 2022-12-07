import mongoose from 'mongoose';

export default mongoose.model(
  'items',
  mongoose.Schema({
    category: String,
    details: Object,
    locationInfo: Object,
    authentication: Object,
    isFound: { type: Boolean, default: false },
    declared: Date,
  })
);
