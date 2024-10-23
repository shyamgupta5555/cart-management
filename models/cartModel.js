const mongoose = require("mongoose");
let objectId = mongoose.Schema.Types.ObjectId;

const cartItemSchema = new mongoose.Schema({
  productId: { type: objectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema(
  {
    items: [cartItemSchema],
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
