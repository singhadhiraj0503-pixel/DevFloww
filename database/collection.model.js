const { Schema, model, models } = require("mongoose");

const collectionSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "Author is required"],
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: "Questions",
      required: [true, "Question is required"],
    },
  },
  { timestamps: true },
);

const collectionModel =
  models.Collections || model("Collections", collectionSchema);

export default collectionModel;
