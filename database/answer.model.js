const { Schema, model, models } = require("mongoose");

const answerSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: "Questions",
      required: [true, "There must be a question"],
    },
    content: {
      type: String,
      require: [true, "There should be some content"],
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const answerModel = models.Answers || model("Answers", answerSchema);

export default answerModel;
