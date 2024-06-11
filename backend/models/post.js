const { Schema, model } = require('mongoose');

const PostSchema = new Schema({
  title: { type: String, required: true },
  timestamp: { type: Date, required: true },
  text: { type: String, required: true },
  isPublished: { type: Boolean },
});

module.exports = model('Post', PostSchema);
