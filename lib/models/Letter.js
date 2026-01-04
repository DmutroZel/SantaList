

import mongoose from 'mongoose';

const LetterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name must be less than 100 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  },
  address: {
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    street: {
      type: String,
      required: [true, 'Street is required'],
      trim: true
    },
    house: {
      type: String,
      required: [true, 'House number is required'],
      trim: true
    },
    apartment: {
      type: String,
      trim: true,
      default: ''
    },
    elevator: {
      type: Boolean,
      default: false
    }
  },
  wishes: [{
    type: String,
    required: true,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

LetterSchema.index({ createdAt: -1 });
LetterSchema.index({ 'address.city': 1 });

export default mongoose.models.Letter || mongoose.model('Letter', LetterSchema);