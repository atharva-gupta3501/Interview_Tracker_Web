const ProgrammingList = require('../models/programming');
const Question = require('../models/question');

///////
var fs = require('fs');
var path = require('path');
////////
const all_page = async (req, res) => {

    try {
        const allTypes = await ProgrammingList.find();
        res.render('programming', { title: 'Categories', list: allTypes });
    }
    catch (err) {
        console.log(err);
    }

}

const type_page = async (req, res) => {
    const title = req.params.title;
    try {
        const type = await ProgrammingList.findOne({ title });
        const id = type._id;
        Question.find({ category: id, approved: true })
            .then((result) => {
                res.render('category', { title: title, result: result, type: type });
            })
            .catch(err => {
                console.log(err);
                res.status(404).send("Page Not Found");
            })

        // for using the below program 
        // activate the questions feature in 
        // ../models/programming.js

        // ProgrammingList.findOne({ title })
        // .populate('questions')
        // .exec((err, type) => {
        //     //console.log(type);
        //     if (err) {
        //         console.log(err);
        //     }
        //     else {
        //         if (type) {
        //             res.render('category1', { title: type.title, type: type });
        //         } else {
        //             res.status(404).send("Page Not Found");
        //         }
        //     }
        // })

    }
    catch (err) {
        console.log(err);
    }
}

const question_page = (req, res) => {
    const title = req.params.title;
    const id = req.params.id;

    Question.findById(id)
        .then((ques) => {
            res.render('question', { title: ques.title, ques: ques });
        })
        .catch((err) => {
            console.log(err);
        })
}
const create_page = (req, res) => {
    res.render('createCategory', { title: 'Create Category' });
}

const create_req = async (req, res) => {
    const { title, body } = req.body;
    console.log(req.body);
    const img = {
        data: fs.readFileSync(path.join(process.cwd() + '/uploads/' + req.file.filename)),
        contentType: 'image/png'
    }
    try {
        const category = await ProgrammingList.create({ title: title, description: body, img: img });
        res.redirect('/programming');
    }
    catch (err) {
        console.log(err);
    }
    // res.send("ok");
}

const create_question = async (req, res) => {
    // console.log(req);
    const { title, type, body } = req.body;
    try {
        const type_name = await ProgrammingList.findOne({ title: type });
        const type_id = type_name._id;
        const ques = await Question.create({ title: title, question: body, category: type_id });
        res.status(201).json({ ques: ques._id });
    }
    catch (err) {
        console.log(err);
    }
}

const all_questions = (req, res) => {
    Question.find({ approved: true })
        .populate('category')
        .exec((err, result) => {
            //console.log(type);
            if (err) {
                console.log(err);
            }
            else {
                res.render('allques', { title: 'All Questions', result: result });
            }
        })
}
module.exports = {
    all_page,
    type_page,
    question_page,
    create_question,
    create_page,
    create_req,
    all_questions
}