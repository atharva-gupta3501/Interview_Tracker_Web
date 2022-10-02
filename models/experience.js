const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expSchema = new Schema({
    experience: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    company: {
        type: Schema.Types.ObjectId,
        ref : 'Company',
    }
}, { timestamps: true });

const Exp = mongoose.model('Exp', expSchema);
module.exports = Exp;