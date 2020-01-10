const express = require("express");
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const Question = require('./db');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

const QuestionSchema = mongoose.model("Questions");

app.post('/questions/', (req, res) => {
   // TODO
   // Create a new question document
   // Send back json (if new document created, send it back in json)
   const userQuestion = req.body.question;

   const newQ = new QuestionSchema({
      question: userQuestion, 
      answers: []
   });

   newQ.save((err, newQuestion) => {
      if (err){
         console.log(err);
         // return res.send(500, "Error: Could not create new question.");
      } else {
         res.json(newQuestion);
      }
   });
   
});

app.post(`/questions/:id/answers/`, (req, res) => {
   // TODO
   // Push the answer to its question (use findByIdAndUpdate)

   console.log("REQ ANSWER: ", req.body.answer);
   Post.findByIdAndUpdate(req.params.id, { "$push": { answers: req.body.answer } }, { "new": true }, (err, docs) => {
      // send back JSON (for example, updated objects... or simply a message saying that this succeeded)
      // ...if error, send back an error message ... optionally, set status to 500
      
      if (err){
         return res.send(500, "Error: Could not add new answer.");
      } else {
         res.json(docs);
      }
      
   });
});

app.get('/questions/', (req, res) => {
   // TODO
   // Retrieve all questions and send back as JSON
   QuestionSchema.find({}, function(err, questions){

      if (err){
         console.log(err);
      } else {
         const qs = req.query.question;

         QuestionSchema.find({question: qs}, function(err){
            if (err) {
               console.log(err);
            } else {
               res.send({questions: questions});
            }
         });
      }

   });

});

app.get('/questions/:id/answers/', (req, res) => {

   QuestionSchema.find({}, function(err, questions){

      if (err){
         console.log(err);
      } else {
         const as = req.query.answers;

         QuestionSchema.find({answers: as}, function(err){
            if (err) {
               console.log(err);
            } else {
               res.send({questions: questions});
            }
         });
      }

   });

});

const port = process.env.PORT || 3000;

app.listen(port, () => {console.log(`Server is listening on ${port}`)});
