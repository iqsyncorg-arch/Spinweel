import mongoose from 'mongoose';

const PrizeSchema = new mongoose.Schema(
  {
    prizeId: {
      type: String,
      required: true,
      unique: true,
    },
    headline: {
      type: String,
      required: true,
    },
    subline: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    bgType: {
      type: String,
      enum: ['white', 'red'],
      default: 'white',
    },
    bgColor: String,
    textColor: String,
    subtextColor: String,
    pillBg: String,
    pillText: String,
    pillBorder: String,
    icon: String,
    description: String,
    terms: String,
    probability: {
      type: Number,
      default: 0.15,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret.prizeId || ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Prize = mongoose.model('Prize', PrizeSchema);

