const { Schema, model, models } = require("mongoose");

const tagQuestionSchema = new Schema(
  {
    tag: {
      type: Schema.Types.ObjectId,
      ref: "Tags",
      requied: [true, "tags are required"],
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: "Questions",
      required: [true, "Questions are required"],
    },
  },
  { timestamps: true },
);

const tagQuestionModel =
  models.TagQuestions || model("TagQuestions", tagQuestionSchema);

export default tagQuestionModel;
