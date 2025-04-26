import mongoose from "mongoose";

const itemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneno: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    itemType: {
      type: String,
      enum: ['lost', 'found'],
      required: true,
      default: 'found'
    }
  },
  {
    timestamps: true,
  }
);

export const Item = mongoose.model("itemSchema", itemSchema);
