const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  // _id: Schema.Types.ObjectId,
  question: {
    type: String,
    required: true
  },
  answers: [String]
});

mongoose.connect('mongodb://localhost/hw07', { useUnifiedTopology: true, useNewUrlParser: true });

module.exports = Post = mongoose.model("Questions", QuestionSchema);
