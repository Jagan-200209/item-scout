import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    bio: {
      type: String,
    },
    profileImage: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

// Drop the existing collection to remove problematic indexes
mongoose.connection.on('connected', () => {
  mongoose.connection.db.collection('users').drop((err) => {
    if (err && err.code !== 26) { // 26 is the error code for collection not existing
      console.error('Error dropping users collection:', err);
    }
  });
});

export const User = mongoose.model("User", userSchema); 