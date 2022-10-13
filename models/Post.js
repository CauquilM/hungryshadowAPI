const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  portion: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  portion: String,
  person: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Posts", PostSchema);
