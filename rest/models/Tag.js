const mongoose= require('mongoose');
const {Schema, model}= mongoose;

const TagSchema= new Schema({
    name: String,
    color: String
});

const Tag= model('Tag', TagSchema);

module.exports = Tag;