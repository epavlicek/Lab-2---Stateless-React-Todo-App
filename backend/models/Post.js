const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  dateCreated: { type: Number, required: true },
  dateCompleted: { type: Number },
  postList: { type: Schema.Types.ObjectId, ref: "PostList" },
  complete: { type: Boolean, required: true },
});

//Export model
module.exports = mongoose.model("Post", PostSchema);
