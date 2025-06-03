const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { STATUS_CODE } = require("../constants/statusCode");

exports.addProductToCart = async (request, response) => {
  const { name, description, price } = request.body;

  const newProduct = new Product(name, description, parseFloat(price));

  try {
    await newProduct.save();
    await Cart.add(name);

    response.status(STATUS_CODE.FOUND).redirect("/products/new");
  } catch (error) {
    console.error(error);
    response.status(500).send("Error adding product.");
  }
};

exports.getProductsCount = async () => {
  return await Cart.getProductsQuantity();
};
