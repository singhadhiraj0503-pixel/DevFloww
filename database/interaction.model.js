const { Schema, model, models } = require("mongoose");

const interactionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "Users are required"],
    },
    actions: {
      type: String,
      required: [true, "Actions are required"],
    },
    actionId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    actionType: {
      type: String,
      enum: ["question", "answer"],
      required: true,
    },
  },
  { timestamps: true },
);

const interactionModel =
  models.Interactions || model("Interactions", interactionSchema);

export default interactionModel;
