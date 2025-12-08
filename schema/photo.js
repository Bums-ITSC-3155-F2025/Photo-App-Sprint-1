"use strict";

const mongoose = require("mongoose");

/**
 * Define the Mongoose Schema for a Comment.
 */
const commentSchema = new mongoose.Schema({
  comment: String,
  date_time: { type: Date, default: Date.now },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

/**
 * Define the Mongoose Schema for a Photo.
 */
const photoSchema = new mongoose.Schema({
  file_name: String,
  date_time: { type: Date, default: Date.now },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  comments: [
    {
      comment: String,
      date_time: { type: Date, default: Date.now },
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }
  ],

  // Users who liked the photo - prevents double likes
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: []
  }
});

module.exports = mongoose.model("Photo", photoSchema);

