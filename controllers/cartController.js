const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const { sendResponse } = require("../helper/responseMessage");

exports.AddProductCart = async (req, res) => {
  try {
    let { productId, quantity } = req.body;

    if (!productId && !quantity) {
      return sendResponse(res, false, 400, "Please Send Required Felid");
    }

    const product = await Product.findById(productId);

    if (!product) {
      return sendResponse(res, false, 400, "Product Not Found");
    }

    if (quantity > product.stock) {
      return sendResponse(res, false, 400, "Out Of stock ");
    }

    let cart = await Cart.findOne();

    if (!cart) {
      let obj = {
        items: [{ productId: productId, quantity: quantity }],
        total: product.price * quantity,
      };
      const createCart = await Cart.create(obj);
      return sendResponse(res, true, 200, "Successfully Add Product", {
        createCart,
      });
    }

    let existingItem = cart.items.find((item) => item.productId == productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    cart.total = cart.items.reduce(
      (acc, item) => acc + item.quantity * product.price,
      0
    );

    await cart.save();
    return sendResponse(res, true, 200, "Successfully Add Product", cart);
  } catch (error) {
    return sendResponse(res, false, 500, error.message);
  }
};

exports.getCartDetails = async (req, res) => {
  try {
    const cart = await Cart.findOne().populate({
      path: "items.productId",
      select: "name price stock",
    });
    if (!cart) {
      return sendResponse(res, false, 400, "Cart not found");
    }
    return sendResponse(res, true, 200, "Successfully  Get Data", { cart });
  } catch (error) {
    return sendResponse(res, false, 500, error.message);
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    if (!quantity) {
      return sendResponse(res, false, 400, " quantity Required");
    }

    const product = await Product.findById(productId);
    if (!product) {
      return sendResponse(res, false, 400, " Product Not Found");
    }

    if (quantity > product.stock) {
      return sendResponse(res, false, 400, "Out Of stock ");
    }

    let cart = await Cart.findOne();
    if (!cart) {
      return sendResponse(res, false, 400, "Cart not found");
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId == productId
    );
    if (itemIndex == -1) {
      return sendResponse(res, false, 400, "Product not in cart");
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart.total = cart.items.reduce(
      (acc, item) => acc + item.quantity * product.price,
      0
    );

    await cart.save();
    return sendResponse(res, true, 200, "Successfully  Update Data", { cart });
  } catch (error) {
    return sendResponse(res, false, 500, error.message);
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne();
    if (!cart) {
      return sendResponse(res, false, 404, "Cart not found");
    }

    const productInCart = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (!productInCart) {
      return sendResponse(res, false, 404, "Product not found in cart");
    }

    await Cart.updateOne(
      { _id: cart._id },
      { $pull: { items: { productId } } }
    );
    cart = await Cart.findOne().populate({
      path: "items.productId",
      select: "price",
    });

    cart.total = cart.items.reduce(
      (acc, item) => acc + item.quantity * item.productId.price,
      0
    );

    await cart.save();
    return sendResponse(res, true, 200, "Remove Products items", cart);
  } catch (error) {
    return sendResponse(res, false, 500, error.message);
  }
};

exports.clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOneAndUpdate({}, { items: [], total: 0 });
    return sendResponse(
      res,
      true,
      200,
      "Successfully Remove all items from the cart"
    );
  } catch (error) {
    return sendResponse(res, false, 500, error.message);
  }
};
