const { Schema, model } = require('mongoose');

const CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  timestamp: { type: Date, required: true },
  text: { type: String, required: true },
});

module.exports = model('Comment', CommentSchema);
