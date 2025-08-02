import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  action: {
    type: String,
    enum: ['SIGNUP', 'LOGIN', 'LOGOUT', 'ADD_NOTE', 'EDIT_NOTE', 'DELETE_NOTE'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.models.Log || mongoose.model('Log', LogSchema);
