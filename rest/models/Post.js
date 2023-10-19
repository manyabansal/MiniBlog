const mongoose= require('mongoose');
const {Schema, model}= mongoose;
const User= require('./User')
const Tag= require('./Tag');

const PostSchema= new Schema({
    title: String,
    date: String,
    categories: [{
      type: Schema.Types.ObjectId,
      ref: 'Tag',
    }],
    summary: String,
    content: String,
    image: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    likesCount: Number,
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    clicks: Number
});

const Post= model('Post', PostSchema);

module.exports = Post;