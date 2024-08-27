const { Schema, model } = require("mongoose");

const expenseSchema = new Schema(
  {
    friend1Name: {
      type: String,
      required: true,
    },
    friend2Name: {
      type: String,
      required: true,
    },
    friend1Phone: {
      type: Number,
      required: true,
    },
    friend2Phone: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const expenseDb = model("expense", expenseSchema);
module.exports = expenseDb;
