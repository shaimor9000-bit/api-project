const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true, unique: true },
  items: [{ type: Number }] // array of pids
}, { timestamps: true });

module.exports = mongoose.model("carts", CartSchema);