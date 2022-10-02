const mongoose = require('mongoose');
const Question = require('./question');
const Schema = mongoose.Schema;


const listSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    img: {
        data: Buffer,
        contentType: String
    }
    //    questions: [{ type: Schema.Types.ObjectId, ref : 'QuestionList'}],
});

const ProgrammingList = mongoose.model('ProgrammingList', listSchema);
module.exports = ProgrammingList;