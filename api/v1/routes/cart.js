const router = require("express").Router();
const auth = require("../middlewares/auth");
const Cart = require("../models/cart");
const Product = require("../models/product");

router.use(auth);

// get my cart
router.get("/", async (req, res) => {
  const cart = await Cart.findOneAndUpdate(
    { userId: req.user.id },
    { $setOnInsert: { userId: req.user.id, items: [] } },
    { new: true, upsert: true }
  ).lean();

  return res.json(cart);
});

// add pid to cart
router.post("/add", async (req, res) => {
  const pid = Number(req.body.pid);
  if (!pid) return res.status(400).json({ message: "pid is required" });

  const cart = await Cart.findOneAndUpdate(
    { userId: req.user.id },
    { $addToSet: { items: pid } },
    { new: true, upsert: true }
  ).lean();

  return res.json(cart);
});

// remove pid
router.delete("/remove/:pid", async (req, res) => {
  const pid = Number(req.params.pid);

  const cart = await Cart.findOneAndUpdate(
    { userId: req.user.id },
    { $pull: { items: pid } },
    { new: true, upsert: true }
  ).lean();

  return res.json(cart);
});

// clear cart
router.post("/clear", async (req, res) => {
  const cart = await Cart.findOneAndUpdate(
    { userId: req.user.id },
    { $set: { items: [] } },
    { new: true, upsert: true }
  ).lean();

  return res.json(cart);
});

// borrow everything in my cart
router.post("/borrow", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id }).lean();
  const pids = cart?.items || [];

  if (pids.length === 0) return res.status(400).json({ message: "cart is empty" });

  const result = await Product.updateMany(
    {
      pid: { $in: pids },
      $or: [{ isBorrowed: false }, { isBorrowed: { $exists: false } }]
    },
    { $set: { isBorrowed: true, borrowedAt: new Date() } }
  );

  // clear cart after borrow
  await Cart.updateOne({ userId: req.user.id }, { $set: { items: [] } });

  return res.json({ result });
});

module.exports = router;