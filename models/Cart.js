const { getDatabase } = require("../database");
const Product = require("./Product");

const COLLECTION_NAME = "carts";
const CART_ID = "defaultCart";

class Cart {
  static async add(productName) {
    const db = getDatabase();

    const product = await Product.findByName(productName);
    if (!product) {
      throw new Error(`Product '${productName}' not found.`);
    }

    const cart = await db
      .collection(COLLECTION_NAME)
      .findOne({ cartId: CART_ID });

    if (!cart) {
      await db.collection(COLLECTION_NAME).insertOne({
        cartId: CART_ID,
        items: [{ product, quantity: 1 }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.name === productName
      );

      if (existingItem) {
        await db
          .collection(COLLECTION_NAME)
          .updateOne(
            { cartId: CART_ID, "items.product.name": productName },
            { $inc: { "items.$.quantity": 1 } }
          );
      } else {
        await db
          .collection(COLLECTION_NAME)
          .updateOne(
            { cartId: CART_ID },
            { $push: { items: { product, quantity: 1 } } }
          );
      }
    }
  }

  static async getItems() {
    const db = getDatabase();
    const cart = await db
      .collection(COLLECTION_NAME)
      .findOne({ cartId: CART_ID });
    return cart?.items || [];
  }

  static async getProductsQuantity() {
    const items = await this.getItems();
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  static async getTotalPrice() {
    const items = await this.getItems();
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  static async clearCart() {
    const db = getDatabase();
    await db
      .collection(COLLECTION_NAME)
      .updateOne({ cartId: CART_ID }, { $set: { items: [] } });
  }
}

module.exports = Cart;
