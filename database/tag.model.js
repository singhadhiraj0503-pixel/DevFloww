const { Schema, model, models } = require("mongoose");

const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tags are required"],
      unique: [true, "Tags must be unique"],
    },
    question: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const tagModel = models.Tags || model("Tags", tagSchema);

export default tagModel;
