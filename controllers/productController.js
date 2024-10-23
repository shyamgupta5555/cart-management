const Product = require("../models/productModel");
const { sendResponse } = require("../helper/responseMessage");

exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    const data = await Product.create({ name, price, stock });

    return sendResponse(res, true, 200, "Successfully create Product", {data});
  } catch (error) {
    return sendResponse(res, false, 500, error.message);
  }
};
