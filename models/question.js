const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quesSchema = new Schema({
    title: String,
    question: {
        type : String,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'ProgrammingList',
    },
    approved :{
        type: Boolean,
        default: false
    },
});

const Question = mongoose.model('QuestionList', quesSchema);
module.exports = Question;