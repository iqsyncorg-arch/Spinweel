import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'global_settings',
      unique: true,
    },
    targetPrizeIndex: {
      type: Number,
      default: null,
    },
    storeName: {
      type: String,
      default: 'MY SPECZ',
    },
    tagline: {
      type: String,
      default: 'THE EYE LOVER',
    },
    supportPhone: {
      type: String,
      default: '+91 7868000645',
    },
    spinsPerDay: {
      type: String,
      default: '1',
    },
    whatsappAutoNotify: {
      type: Boolean,
      default: true,
    },
    soundEnabled: {
      type: Boolean,
      default: true,
    },
    minBillAmount: {
      type: String,
      default: '1999',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Setting = mongoose.model('Setting', SettingSchema);

