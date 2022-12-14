const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostListchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("PostList", PostListSchema);
