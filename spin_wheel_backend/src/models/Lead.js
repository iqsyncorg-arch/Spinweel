import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    spectaclesUser: {
      type: String,
      enum: ['yes', 'sunglasses_only', 'no'],
      default: 'yes',
    },
    whatsappUpdates: {
      type: Boolean,
      default: true,
    },
    wonPrize: {
      id: String,
      headline: String,
      subline: String,
      code: String,
      description: String,
      terms: String,
      voucherCode: String,
      validity: {
        type: String,
        default: 'Lifetime Validity (No Expiry)',
      },
      wonAt: Date,
    },
    voucherCode: {
      type: String,
      index: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id ? ret._id.toString() : doc._id.toString();
        ret._id = ret.id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Lead = mongoose.model('Lead', LeadSchema);

