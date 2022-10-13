const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  portion: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  comment: String,
  person: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Posts", PostSchema);
